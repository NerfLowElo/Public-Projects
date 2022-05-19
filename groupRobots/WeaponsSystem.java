package groupRobots;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.List;

import robocode.AdvancedRobot;
import robocode.ScannedRobotEvent;
import robocode.util.Utils;

/* 
 * Class responsible for dealing with the radar and gun - the weapon's system of the tank.
 * Mostly inspired by content found on the Robocode wiki.
 * Implements GuessFactorTargeting and Turn Multiplier Lock radar.*/

public class WeaponsSystem {

	AdvancedRobot		robot;
	
	double 				BULLET_POWER = 2.1; 
	// This is a random number. Discussion on the Robocode wiki indicates that any number x | 1.9 > x > 2.5
	// should have similar performance, so we picked something in the middle of that range.
	
	int 				direction = 1;
	// This indicates the direction the enemy robot is moving in in relation to our robot.
	// 1 means clockwise, -1 means counterclockwise.
	
	double 				absBearing; // Bearing in relation to the enemy's bearing.
	//double 				lastEnemyVelocity = 0;
	double				enemyVelocity = 0;

	List<WaveBullet> 	waves = new ArrayList<WaveBullet>();
	WaveBullet 			latestWave;
	
	Point2D.Double		battlefieldCenter;
	

    
    public WeaponsSystem(AdvancedRobot robot) {
    	this.robot = robot;
    }
    
    /*
     * Method responsible for keeping the enemy under radar lock.
     * @param e the enemy robot.
     */
    public void trackEnemy(ScannedRobotEvent e) {
		absBearing = robot.getHeadingRadians() + e.getBearingRadians();
        
		// Attempts to maintain a lock on the target by moving as much as the target possibly can.
        double radarTurn = absBearing - robot.getRadarHeadingRadians();
        robot.setTurnRadarRightRadians(2*Utils.normalRelativeAngle(radarTurn));
	}
    
    /*
     * Method responsible for handling aiming and firing of the tank's gun.
     * @param e The currently scanned robot.
     * @param enemyPos The enemy's position.
     * @param stats The targeting matrix, used for learning where to aim. */
    public void aimAndFire(ScannedRobotEvent e, Point2D.Double enemyPos, int[][][] stats) {
        double power = BULLET_POWER;
        if (e.getDistance() < 100) {
        	// If the enemy is very close, we fire with the maximum power.
            power = 3.0;
        }
        
        absBearing = robot.getHeadingRadians() + e.getBearingRadians();
        
        // We check if any wave in our list can't possible hit the target any more.
        // If so, we remove.
        // Explanation (and source of the code) can be found at https://robowiki.net/wiki/GuessFactor_Targeting_Tutorial
        for (int i=0; i < waves.size(); i++) {
            WaveBullet currentWave = (WaveBullet)waves.get(i);
            if (currentWave.checkHit(enemyPos.x, enemyPos.y, robot.getTime())) {
                waves.remove(currentWave);	
                i--;
            }
        }
        
        //lastEnemyVelocity = enemyVelocity;
        enemyVelocity = e.getVelocity();
        
        //Find out if enemy is moving clockwise or counter-clockwise
        //If enemy velocity = 0, there is no need to test it - he's standing still
        if (enemyVelocity != 0) {
            if (Math.sin(e.getHeadingRadians() - absBearing)*enemyVelocity < 0) {
                direction = -1;
            } else {
            	direction = 1;
            }
        }
        
        /* 
         * Currently unused.
         *  //Used for segmentation of targeting info.
        	int accel = 0;
        	if (Math.abs(enemyVelocity) - Math.abs(lastEnemyVelocity) > 0) {
        		accel = 0;
        	} else if (Math.abs(enemyVelocity) - Math.abs(lastEnemyVelocity) == 0) {
        		accel = 1;
        	} else {
        		accel = 2;
        }
        
         */
       
        
        // Determines how fast the enemy is moving laterally in relation to us.
        // Used for segmentation of targeting info.
        double enemyAbsoluteBearing = e.getBearingRadians() + robot.getHeadingRadians();
        double enemyLateralVelocity = e.getVelocity() * Math.sin(e.getHeadingRadians() - enemyAbsoluteBearing);
        int elvMapping;
        
        if (enemyLateralVelocity > 0) {
        	elvMapping = 0;
        } else if (enemyLateralVelocity == 0) {
        	elvMapping = 2;
        } else {
        	elvMapping = 1;
        }
        
		/* Currently not used
		 * // Determines how far the enemy is from the center of the battlefield. //
		 * Used for segmentation of targeting info. battlefieldCenter = new
		 * Point2D.Double(robot.getBattleFieldWidth()/2,
		 * robot.getBattleFieldHeight()/2); double enemyDistanceToCenter =
		 * enemyPos.distance(battlefieldCenter);
		 */
        
        // We load the stats pertaining to the situation we're currently facing.
        int[] currentStats = stats[(int)(e.getDistance() / 100)][elvMapping];
        
        // Code below was sourced from the same GuessFactoringTutorial mentioned above.
        // https://robowiki.net/wiki/GuessFactor_Targeting_Tutorial
        // Some modifications were made to allow for different segmentation.
        // A check was also added so the tank can keep firing when it's energy is extremely low.
        WaveBullet newWave = new WaveBullet(robot.getX(), robot.getY(), absBearing, power, 
        									direction, robot.getTime(), 
        									stats[(int)(e.getDistance() / 100)][elvMapping]);

        int bestIndex = 15;
        for (int i=0; i < 31; i++) {
            if (currentStats[bestIndex] < currentStats[i]) {
                bestIndex = i;
            }
        }
        double guessFactor = (double)(bestIndex - (currentStats.length - 1) / 2) / ((currentStats.length -1) / 2);
        double angleOffset = direction * guessFactor * newWave.maxEscapeAngle();
        double gunAdjust = Utils.normalRelativeAngle(absBearing - robot.getGunHeadingRadians() + angleOffset);
        robot.setTurnGunRightRadians(gunAdjust);
            
        if (robot.getEnergy() > 3) {
        	if (robot.getGunHeat() == 0 && gunAdjust < Math.atan2(9, e.getDistance()) && robot.setFireBullet(power) != null) {
                waves.add(newWave);
        	} 
        } else {
    		power = robot.getEnergy() - 0.1;
    		if (robot.getGunHeat() == 0 && gunAdjust == 0 && robot.setFireBullet(power) != null) {
                waves.add(newWave);
    	}
     }
    }
}


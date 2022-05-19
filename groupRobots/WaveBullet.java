package groupRobots;

import java.awt.geom.Point2D;

import robocode.util.Utils;


/* 
 * Class was copied from the Robocode wiki page for GuessFactorTargeting.
 * It can be found @ https://robowiki.net/wiki/GuessFactor_Targeting_Tutorial
 * */
public class WaveBullet {
    private double  startX, startY, startBearing, power;
    private long    fireTime;
    private int     direction;
    private int[]   returnSegment;

    public WaveBullet(double x, double y, double bearing, double power, int direction, long time, int[] segment) {
        startX          = x;
        startY          = y;
        startBearing    = bearing;
        this.power      = power;
        this.direction  = direction;
        fireTime        = time;
        returnSegment   = segment;
    }
    
    /*
     * Calculates the bullet speed based on the bullet's power.
     * @return the bullet's speed. 
     */
    public double getBulletSpeed() {
        return 20 - power * 3;
    }
    
    /*
     * Calculates the maximum angle of escape for the enemy robot.
     * @return the max escape angle.
     */
    public double maxEscapeAngle() {
        return Math.asin(8 / getBulletSpeed());
    }
    
    /*
     * Checks if a wave can still hit and writes the results to the targeting stats matrix.
     * @param enemyX The X coord of the enemy's position.
     * @param enemyY The Y coord of the enemy's position.
     * @param currentTime the current tick.
     * @return Boolean representing if a wave can still hit the target or not.
     */
    public boolean checkHit(double enemyX, double enemyY, long currentTime) {
        if (Point2D.distance(startX, startY, enemyX, enemyY) <= (currentTime - fireTime) * getBulletSpeed()) {
            double desiredDirection = Math.atan2(enemyX - startX, enemyY - startY);
            double angleOffset = Utils.normalRelativeAngle(desiredDirection - startBearing);
            double guessFactor = Math.max(-1, Math.min(1, angleOffset / maxEscapeAngle())) * direction;
            int index = (int) Math.round((returnSegment.length -1) / 2 * (guessFactor + 1));
            returnSegment[index]++;
            return true;
        }
        return false;
    }
}

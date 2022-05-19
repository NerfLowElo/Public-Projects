package groupRobots;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;

import robocode.AdvancedRobot;
import robocode.ScannedRobotEvent;

/* 
 * Class responsible for acquiring and aggregating information, as well as acting on it.
 * Currently uses a movement mechanism inspired on the one found on the HawkOnFire robot,
 * but this will probably change in the near future in order to use WaveSurfing.
 * */
public class Commander {
	AdvancedRobot robot;
	
	private Tracks 				tracks;
	private Rectangle2D.Double 	battlefield;
	
	private Point2D.Double 		myPos;
	private Point2D.Double		lastPos;
	public  Point2D.Double 		enemyPos = new Point2D.Double(0,0);
	private double 				distanceToEnemy;
	
	private Point2D.Double 		waypoint;
	private double 				distanceToWaypoint;
	
	public Commander (AdvancedRobot robot, WeaponsSystem weaponsSystem, Tracks tracks) {
		this.robot = robot;
		this.tracks = tracks;
		this.myPos = new Point2D.Double(robot.getX(), robot.getY());
		this.lastPos = this.myPos;
		this.battlefield = new Rectangle2D.Double(36, 36, robot.getBattleFieldWidth() - 72, robot.getBattleFieldHeight() - 72);
		this.waypoint = myPos;
		this.distanceToWaypoint = 0;
	}
	
	/*
	 * Updates our robot's positional record.
	 */
	public void updatePosition () {
		this.myPos.setLocation(robot.getX(), robot.getY());
		this.distanceToWaypoint = myPos.distance(waypoint);
	}
	
	/*
	 * Calculates the enemy's coordinates using the information we have available.
	 * @param e The enemy robot.
	 */
	public void updateEnemyCoords (ScannedRobotEvent e) {
		final double absBearing = robot.getHeadingRadians() + e.getBearingRadians();
		this.distanceToEnemy = e.getDistance();
		final double enemyX = myPos.x + Math.sin(absBearing) * distanceToEnemy;
		final double enemyY = myPos.y + Math.cos(absBearing) * distanceToEnemy;
		this.enemyPos.setLocation(enemyX, enemyY);
	}
	
	/*
	 * 	Checks if we're getting close to the established waypoint.
	 	If so, it runs the waypoint selection method and starts moving there. 
		If not, it simply reiterates the order to move to the waypoint.
	 */
	public void issueMoveOrder() {
		if (distanceToWaypoint < 15) {
			waypoint = selectWaypoint();
		} else {
			tracks.moveTo(this.waypoint);
			lastPos = myPos;
		}
	}
	
	/*
	 * Creates a series of test waypoints and calls the evaluation method on all of them, then returns the best one it finds.
	 * @return The chosen waypoint.
	 */
	private Point2D.Double selectWaypoint() {
			final int NUMBER_OF_POINTS = 200; // Number of testPoints to generate for each selection
			int i = 0;
			
			Point2D.Double testPoint;
			Point2D.Double newWaypoint = waypoint; // It is possible that we find no better waypoint, so this must be initialized.
			
			do {
				testPoint = makeTestPoint();	
				if (battlefield.contains(testPoint) 
						&& evaluate(testPoint) < evaluate(waypoint)) {
					newWaypoint = testPoint;
				} 
			} while (i++ < NUMBER_OF_POINTS);
			return newWaypoint;
	}
	
	/*
	 * Creates a series of test points to feed into the selectWaypoint() method.
	 * Tries to stay away from the enemy robot, so as not to ram into him
	 * @return A point to be tested.
	 */
	private Point2D.Double makeTestPoint() {
		final Point2D.Double testPoint = 
				MathUtils.calcPoint(myPos, Math.min(distanceToEnemy, 100+400*Math.random()), 2*Math.PI*Math.random());
		return testPoint;
	}  
	
	/*
	 * Evaluates a point and ranks it based on safety.
	 * @param testPoint The testPoint to be evaluated.
	 * @return The given evaluation.
	 */
	private double evaluate (Point2D.Double testPoint) {
        double eval = 1 / testPoint.distanceSq(lastPos);
        eval += (1+ Math.abs(Math.cos(MathUtils.calcAngle(myPos, testPoint) 
                    - MathUtils.calcAngle(enemyPos, testPoint)))) / (testPoint.distanceSq(enemyPos)/3);
        return eval;
    }
	

}

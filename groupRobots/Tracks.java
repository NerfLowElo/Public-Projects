package groupRobots;

import java.awt.geom.Point2D;

import robocode.AdvancedRobot;
import robocode.util.Utils;

/* 
 * This class handles movement.
 * It basically exists because calling moveTo() is easier than writing all this,
 * but this method wouldn't make sense in one of the other classes. 
 * The code was sourced from the Robocode wiki @ https://robowiki.net/wiki/GoTo.
 * */
public class Tracks{
	private AdvancedRobot robot;
	
	public Tracks(AdvancedRobot robot) {
		this.robot = robot;
	}
	
	/*
	 * Moves to given waypoint.
	 * @param waypoint Waypoint to move to.
	 */
	public void moveTo(Point2D.Double waypoint) {
	    /* Calculate the difference between the current position and the target position. */
	    final double x = waypoint.x - robot.getX();
	    final double y = waypoint.y - robot.getY();
	    
	    /* Calculate the angle relative to the current heading. */
	    final double goAngle = Utils.normalRelativeAngle(Math.atan2(x, y) - robot.getHeadingRadians());
		
	    /*
	     * Apply a tangent to the turn this is a cheap way of achieving back to front turn angle as tangents period is PI.
	     * The output is very close to doing it correctly under most inputs. Applying the arctan will reverse the function
	     * back into a normal value, correcting the value. The arctan is not needed if code size is required, the error from
	     * tangent evening out over multiple turns.
	     */
	    robot.setTurnRightRadians(Math.atan(Math.tan(goAngle)));
		
	    /* 
	     * The cosine call reduces the amount moved more the more perpendicular it is to the desired angle of travel. The
	     * hypot is a quick way of calculating the distance to move as it calculates the length of the given coordinates
	     * from 0.
	     */
	    robot.setAhead(Math.cos(goAngle) * Math.hypot(x, y));
	    
	}
}

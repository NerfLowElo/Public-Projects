package groupRobots;

import java.awt.geom.Point2D;


public class MathUtils {
    // Calculates a new point that is a certain distance away and at a certain angle.
    public static Point2D.Double calcPoint(Point2D.Double point, double distance, double angle) {
        return new Point2D.Double(point.x + distance*Math.sin(angle), point.y + distance*Math.cos(angle));
    }

    // Calculates the angle between 2 vectors
    public static double calcAngle(Point2D.Double pointA, Point2D.Double pointB) {
        return Math.atan2(pointB.x - pointA.x, pointB.y - pointA.x);
    }
}

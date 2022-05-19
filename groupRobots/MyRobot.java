package groupRobots;

import robocode.AdvancedRobot;
import robocode.ScannedRobotEvent;

public class MyRobot extends AdvancedRobot {
	Commander co;
	WeaponsSystem weapons;
	static Tracks tracks;
	
    // We segment our targeting info on range and lateralVelocity
    // Range: 12 segments of 100ft (1200ft is the radar's max range)	
	// This has to be static and in the main class if we want to save information between rounds
    static int[][][] stats;
	
	public void run() {
		stats = new int[13][3][31];
		weapons = new WeaponsSystem(this);
		tracks = new Tracks(this);
		co = new Commander(this, weapons, tracks);
		
		setAdjustRadarForGunTurn(true);
		setAdjustGunForRobotTurn(true);
		turnRadarRight(Double.POSITIVE_INFINITY);
		
		do {
			scan();
		} while (true);
	}
	
	@Override
	public void onScannedRobot(ScannedRobotEvent e) {
		co.updateEnemyCoords(e);
		weapons.trackEnemy(e);
		weapons.aimAndFire(e, co.enemyPos, stats);
		co.issueMoveOrder();
		co.updatePosition();
		
	}
}



public class Points{

	private int x;
	private int y;

	Points(int a, int b) {
		x = a;
		y = b;
	}	

	public int getx() { return x; }
	public int gety() { return y; }

	public void setx(int a) { x = a; }
	public void sety(int b) { y = b; }

	public long edistance(Points b) {
		long result = (b.getx()-x)*(b.getx()-x) + (b.gety()-y)*(b.gety()-y);
		return result;
	}

	public int crossProduct(Points b, Points c) {
		return((b.getx()-x)*(c.gety()-y) - (b.gety()-y)*(c.getx()-x));     
	}

	public String toString() {
		return "(" + x + "," + y +")";
	}

}



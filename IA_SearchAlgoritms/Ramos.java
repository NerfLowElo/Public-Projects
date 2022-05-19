import java.util.*;

public class Ramos{

	private Points a;
	private Points b;

	Ramos(Points a1, Points a2) {
		a = a1;
		b = a2;
	}

	public Points getFirst() {return a;}
	public Points getLast() {return b;}
	public void setFirst(Points a1) {this.a = a1;}
	public void setLast(Points a2) {b = a2;}

	public boolean interset(Ramos r) {
		if( a==r.getFirst() || a == r.getLast() || b==r.getFirst() || b==r.getLast())
			return false;

		int d1 = a.crossProduct(b,r.getFirst());
		int d2 = a.crossProduct(b,r.getLast());
		int d3 = r.getFirst().crossProduct(r.getLast(), a);
		int d4 = r.getFirst().crossProduct(r.getLast(), b);

		if ( ((d1>0 && d2<0) || (d1<0 && d2>0)) && ((d3>0 && d4<0) || (d3<0 && d4>0)) )
			return true;
		else if ( d1==0 && this.belongs(r.getFirst()) ) 
			if(d2==0 && this.internProduct(r) >0) 
				return true;
		else if ( d2==0 && this.belongs(r.getLast()) )
			return true;
		else if ( d3==0 && r.belongs(a))
			if (d4==0 && r.internProduct(r) >0)
				return true;
		else if (d4==0 && r.belongs(b))
			return true;
		return false;	

	}

	public int internProduct(Ramos r) {
		return ( (b.getx()-a.getx()) * (r.getLast().getx()-r.getFirst().getx()) + 
			     (b.gety()-a.gety()) * (r.getLast().gety()-r.getFirst().gety()) );
	}

	public boolean belongs(Points p) {
		int minx = Math.min(a.getx(),b.getx());
		int maxx = Math.max(a.getx(),b.getx());
		int miny = Math.min(a.gety(),b.gety());
		int maxy = Math.max(a.gety(),b.gety());

		if( (p.getx()>=minx && p.getx()<=maxx) && (p.gety()>=miny && p.gety()<=maxy) )
			return true;
		else return false;
	}

	public String toString() {
		return  a + "->" + b;
	}
}
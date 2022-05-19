import java.util.*;

class Grafo{
	
	private int size;
	private LinkedList<Points> list;

	Grafo() {
		size = 0;
		list = new LinkedList<Points>();
	}

	public int getSize() {
		return size;
	}

	public boolean addPoint (Points a) {
		if (list.add(a) ){
			size++;
			return true;
		}
		return false;
	}

	public Points getPoint(int i) {
		return list.get(i);
	}


	public String toString() {
		String anwers = "{";
		anwers	+= list.getFirst();

		for(int i=1; i<list.size(); i++) {			
			anwers += " -> " + list.get(i);
		}
		anwers += "}";
		return anwers;	
	}

}
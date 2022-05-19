import java.util.*;


public class MainIA {

	public static void main(String[] args) {

		Scanner in = new Scanner(System.in);

		int n = in.nextInt();
		

		Points[] conjunto = new Points[n];
		int a, b;
		Points p;

		for (int i=0; i<n; i++) {
			a = in.nextInt();
			b = in.nextInt();
			p = new Points(a,b);
			conjunto[i]=p;
			//System.out.print(p);			 
		}
		//System.out.println();
		//System.out.println(m);

		Grafo allr = all_random(conjunto);

		/*for(Points i : conjunto)
			System.out.print(i);
		System.out.println();*/

		Grafo sol = nearest_neighbour(conjunto);

		Grafo hsol = hsBest(sol);

		Grafo hsfirst = hsFirst(sol);
		
		Grafo hsrandom = hsRandom(sol);
	}


	public static Grafo all_random(Points[] group) {
		Grafo g = new Grafo();
		int n = group.length;
		Random r = new Random();
		Points[] newg = group;
		
		int f = r.nextInt(n);
		//System.out.println("nº random " + f);
		Points first = newg[f];
		g.addPoint(first);

		Points curr = newg[n-1];
		newg[n-1] = first;
		newg[f] = curr;

		for(int i=1; i<n; i++) {
			f =  r.nextInt(n-i);
			//System.out.println("nº random " + f);
			g.addPoint(newg[f]);

			curr = newg[n-1-i];
			newg[n-1-i] = newg[f];
			newg[f] = curr;
		}

		g.addPoint(first);

		System.out.println("all_random: " + g);
		return g;
	}


	public static Grafo nearest_neighbour(Points[] group) {
		Grafo g = new Grafo();
		int n = group.length;
		int[] visit = new int[n];
		for(int i : visit)
			i=0;

		int f = r.nextInt(n);
		//int f = 0;
		Points first = group[f];
		g.addPoint(first);
		visit[f] = 1;
		Points curr = first;

		for(int i=1; i<n; i++) {
			long min;
			int k=0;
			
			while(visit[k] != 0) {
				k++;
			}					
			min = curr.edistance(group[k]);
			//System.out.println("minimo " + min + " entre:" + curr + ", " + group[k]);
									
			for(int j=0; j<n; j++) 
				if(visit[j] == 0) {		
					//System.out.println(curr.edistance(group[j]));		
					if(min > curr.edistance(group[j])) {
						min = curr.edistance(group[j]);
						k = j;
					}
			}
			visit[k] = 1;
			curr = group[k];			
			g.addPoint(curr);														
		}

		g.addPoint(first);


		/*Ramos[] arc = new Ramos[n];
		Ramos xpto;
		for(int i=0; i<n; i++) {
			xpto = new Ramos(g.getPoint(i),g.getPoint(i+1));
			arc[i] = xpto;
		}
		LinkedList<Points> l = two_exchange(arc);*/

		System.out.println("nearest_neighbour: " + g);
		return g;
	}


	public static LinkedList<Points> two_exchange(Ramos[] r) {
		int n = r.length;
		int[] visit = new int[n];
		for (int i : visit)
			i=0;

		//for(Ramos i : r)
			//System.out.println(i);
		LinkedList<Points> s = new LinkedList<>();

		for (int i=0; i<n; i++) {
			visit[i] = 1;
			for(int j=0; j<n-1; j++) {
				if(visit[j] != 1) {
					//System.out.println(r[i] + " " + r[j]);
					if ( r[i].interset(r[j]) ) {
						Points curr = new Points(i,j);
						//System.out.println(curr + " ramos: " + r[i] + " " + r[j]);
						s.addLast(curr);	 
					}
				}
			}
			visit[i] = 0;
		}
		//System.out.println();
		return s;
	}

	public static Ramos[] exchange(Ramos[] r, int i, int j) {
		Points aux = r[i].getLast();
		r[i].setLast(r[j].getFirst());
		r[j].setFirst(aux);
		int y=i;
		while(y+1!=j) {
			y++;
			aux = r[y].getLast();
			r[y].setLast(r[y].getFirst());
			r[y].setFirst(aux);

		}
		//System.out.println("condiçao " + (j-i-2));
		for(int k=2; j-i-k>=1; k+=2) {
			//System.out.println("k= " + k + " k/2= " + k/2);
			Ramos crr = r[j-(k/2)];
			r[j-(k/2)] = r[i+(k/2)];
			r[i+(k/2)] = crr;

		}
		return r;
	}

	public static Grafo hsBest(Grafo group) {
		int n = group.getSize();
		Ramos[] r = new Ramos[n-1];
		Ramos xpto;
		//System.out.print("ramosOriginais: ");
		for(int i=0; i<n-1; i++) {
			xpto = new Ramos(group.getPoint(i),group.getPoint(i+1));
			r[i] = xpto;
			//System.out.print(xpto);
		}
		//System.out.println();

		long min;
		do {
			LinkedList<Points> s = two_exchange(r);
			min=0;
			int i=0, j=0;
			while(!s.isEmpty()) {
				Points alpha = s.remove();
				long perimetro = (r[alpha.getx()].getFirst().edistance(r[alpha.gety()].getFirst()) +
					 			r[alpha.getx()].getLast().edistance(r[alpha.gety()].getLast())) -
					 			(r[alpha.getx()].getFirst().edistance(r[alpha.getx()].getLast()) + 
					 			r[alpha.gety()].getFirst().edistance(r[alpha.gety()].getLast()));
				//System.out.println("perimetro= " + perimetro);	 			
				if ( perimetro < min) {
					min = perimetro;
					i=alpha.getx();
					j=alpha.gety();
				}
			}
			if (min<0) {
				//System.out.println("exchange: " + i + "," + j);
				if(i>j) r = exchange(r, j, i);
				else	r = exchange(r, i, j); 
			}
			} while(min<0);
		
		
		Grafo g = new Grafo();
		g.addPoint(r[0].getFirst());
		//System.out.print("ramosHs: ");
		for (Ramos i : r) {
			g.addPoint(i.getLast());
			//System.out.print(i);
		}
		//System.out.println();
		System.out.println("HsBest: " + g);
		return g;
	}

	public static Grafo hsFirst(Grafo group) {
		int n = group.getSize();
		Ramos[] r = new Ramos[n-1];
		Ramos xpto;
		//System.out.print("ramosOriginais: ");
		for(int i=0; i<n-1; i++) {
			xpto = new Ramos(group.getPoint(i),group.getPoint(i+1));
			r[i] = xpto;
			//System.out.print(xpto);
		}				
		LinkedList<Points> s = two_exchange(r);
		while (!s.isEmpty()) {		
			Points alpha = s.remove();
			int i = alpha.getx();
			int j = alpha.gety();
			if(i>j) r = exchange(r, j, i);
			else	r = exchange(r, i, j);
			s = two_exchange(r); 
		}
						
		Grafo g = new Grafo();
		g.addPoint(r[0].getFirst());
		for (Ramos k : r) 
			g.addPoint(k.getLast());
		System.out.println("HsFirst: " + g);
		return g;
	}


	public static Grafo hsRandom(Grafo group) {
		int n = group.getSize();
		Ramos[] r = new Ramos[n-1];
		Ramos xpto;
		//System.out.print("ramosOriginais: ");
		for(int i=0; i<n-1; i++) {
			xpto = new Ramos(group.getPoint(i),group.getPoint(i+1));
			r[i] = xpto;				//System.out.print(xpto);
		}
		Random rr = new Random();				
		LinkedList<Points> s = two_exchange(r);
		while (!s.isEmpty()) {
			int size = s.size();
			int t = rr.nextInt(size);		
			Points alpha = s.remove(t);
			int i = alpha.getx();
			int j = alpha.gety();
			if(i>j) r = exchange(r, j, i);
			else	r = exchange(r, i, j);
			s = two_exchange(r); 
		}
							
		Grafo g = new Grafo();
		g.addPoint(r[0].getFirst());
		for (Ramos k : r) 
			g.addPoint(k.getLast());
		System.out.println("HsRandom: " + g);
		return g;
	}
}





























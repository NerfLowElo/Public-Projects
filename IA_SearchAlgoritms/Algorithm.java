public class Algorithm {

	public static void all_random(Points[] group) {
		Grafo g = new Grafo();
		Random r = new Random();
		int n = group..length

		int f = r.nextInt()%n;
		Points first = group[f];
		g.addPoint(first);

		Points curr = group[n-1];
		group[n-1] = first;
		group[f] = curr;

		for(int i=1; i<n; i++) {
			f =  r.nextInt()%(n-i);
			g.addPoint(group[f]);

			curr = group[n-1-i];
			group[n-1-i] = group[f];
			group[f] = curr;
		}

		g.addPoint(first);
		System.out.println(g);


	}
}
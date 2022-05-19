import  java.util.*;

public class Generator{

	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);

		int n = in.nextInt();
		int m = in.nextInt();
		int low = -m;
		int high = m;
		Random r = new Random();
		int a; int b;
		int[] conjPontos = new int[2*n];

		for (int i=0; i<n*2; i+=2) {
			int flag1=0; int flag2=0;
			a = r.nextInt(high-low) + low;
			b = r.nextInt(high-low) + low;
			for(int j=0; j<2*n; j+=2) {
				if(conjPontos[j]==a) flag1=1;
				if(conjPontos[j+1]==b) flag2=1;
			}
			if(flag1==1 && flag2==1) i--;
			else {conjPontos[i]=a; conjPontos[i+1]=b;}
		}
		
		System.out.println(n);
		for (int i : conjPontos) {
			System.out.print(i + " ");
		}
		System.out.println();

	}
}

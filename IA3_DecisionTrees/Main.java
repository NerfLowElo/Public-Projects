import java.util.*;

public class Main {

	public static void main(String[] args) {
		
		Scanner input = new Scanner(System.in);
		String delimiter = ",";
		String s[];
		DataTable table = new DataTable(input.next().split(delimiter));

		while(input.hasNext()) {
			table.addSet(input.next().split(delimiter));		
		}
		//table.printDataTable();

		DataTree tree = new DataTree(table);
		tree.printTree();
	}



}
import java.util.*;

public class DataTree {

	/*class Node{
		
		private String valName;
		private List<Node> nodes;

		Node(String name) {
			this.valName = name;
		}

		public String getName() { return this.valName;}

		public String toString() { return this.valName;}
	}*/ 

	private String root;
	private Map<String,DataTree> branches;
	private DataTable table;

	DataTree(DataTable table) {
		this.table = table;
		branches = new HashMap<>();
		this.createTree();
	}

	DataTree(String root) {
		this.root = root;
		this.branches = null;
	}

	private void createTree() {
		this.root = this.table.chooseRoot();
		

		int rootIndex = this.table.getVarIndex(root);
		Map<String,List<Integer>> valuesList = this.table.occurrencesList(rootIndex);

		for(String i : valuesList.keySet()) {
			if(this.table.allSameClass(rootIndex, valuesList.get(i))) {
				String x = table.getClass(valuesList.get(i).get(0));
				branches.put(i, new DataTree(x));
				continue;
			}
			
			//criar nova tabela so com os sets que tem em conta este value da var
			DataTable sonTable = table.particion(rootIndex, valuesList.get(i));
		 	System.out.println(root);
		 	sonTable.printDataTable();
		 	branches.put(i,new DataTree(sonTable));
		}
	}

	public void printTree() {
		System.out.println(root);
		if(branches == null) return;
		for(String i : branches.keySet()) {
			String spacing = " ";
			System.out.print(spacing + i);
			branches.get(i).printTree(spacing);
		}
	}

	private void printTree(String spacing) {
		if(branches == null) { 
			System.out.println(spacing + root);
			return;
		}
		System.out.println();
		spacing = spacing + " ";
		System.out.println(spacing + root);
		for(String i : branches.keySet()) {			
			String spacingPlus = " " + spacing;
			System.out.print(spacingPlus + i);
			branches.get(i).printTree(spacingPlus);
		}
	}

}
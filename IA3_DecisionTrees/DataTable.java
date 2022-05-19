import java.util.*;

public class DataTable{

	String[] vars;
	List<String[]> sets = new LinkedList<>();

	DataTable(String[] vars) {
		this.vars = vars;
	}

	public void addSet(String[] set) {
		this.sets.add(set);
	}

	public String getLastVar() {
		return vars[vars.length-1];
	}

	public int getVarIndex(String variable) {
		for(int i=0; i<vars.length; i++) {
			if(vars[i].equals(variable)) { return i;}
		}
		return -1;

	}

	public boolean allSameClass(int valIndex, List<Integer> list) {
		int lastIndex = vars.length-1;
		String value = sets.get(list.get(0))[lastIndex];
		for(int i : list) {
			if(!sets.get(i)[lastIndex].equals(value)) return false;
		}
		return true;
	}

	public String getClass(int valIndex) {
		return sets.get(valIndex)[vars.length-1];
	}

	public DataTable particion(int valIndex, List<Integer> list) {
		String[] y = new String[vars.length-1];
		int k=0;
		while(k!=valIndex) {
			y[k] = new String(vars[k]);
			k++;
		}
		for(k=k+1; k<vars.length; k++) {
			y[k-1] = new String(vars[k]);
		}
		DataTable result = new DataTable(y);


		for(int i : list) {
			String[] curr = sets.get(i);
			String[] x = new String[curr.length-1];
			int j=0;

			while(j!=valIndex) {
				x[j] = new String(curr[j]);
				j++;
			}
			for(j=j+1; j<curr.length; j++ ) {
				x[j-1] = new String(curr[j]);
			}
			result.addSet(x);
		}
		return result;
	}

//-------------------------------------------------------------------------------------------CHOOSING ROOT METHODS-----------------------------------------

	public String chooseRoot() {
		String root = "";
		double max_gain = 0;
		double table_entropy = this.entropyOfTable();
		
		for(int i=1; i<vars.length-1; i++) {
			
			//calcular informationGain
			double info_gain = table_entropy;
			Map<String,List<Integer>> values = occurrencesList(i);
			double n = 0;
			for(String j : values.keySet()){
				n+= values.get(j).size();
			}
			//System.out.println("n = " + n);
			for(String j : values.keySet()) {
				//System.out.println("p(x) = " + values.get(j).size());
				info_gain += -(values.get(j).size()/n) * hValue(values.get(j));
			}
			//System.out.println(vars[i] + " info_gain= " + info_gain);
			if(info_gain > max_gain) {
				max_gain = info_gain;
				root = vars[i];
			}


		}
		return root;
	}


	private double hValue(List<Integer> list) {
		double hValue = 0;
		double n = list.size();
		Map<String,Double>  v = new HashMap<>();
		for (int i : list) {
			String[] set = sets.get(i);
			String value = set[set.length-1];
			Double finalValue = v.get(value);

			if(finalValue == null) { v.put(value, 1.0);
			} else { v.put(value, finalValue+1); }
		}
		for(String i : v.keySet()) {
			double x = v.get(i)/n;
			hValue += -x*(Math.log(x)/Math.log(2));
		}
		//System.out.println("Map " + v);
		//System.out.println("hValue " + hValue);
		return hValue;
	}



	//entropia da tabela
	private double entropyOfTable() {
		double n = sets.size();
		double entropy = 0;
		Map<String,Double> occurrencesMap = this.occurrences(vars.length-1);
		
		for(String i : occurrencesMap.keySet()) {
			double x = occurrencesMap.get(i)/n;
			entropy += -x*(Math.log(x)/Math.log(2));
		}
		return entropy;
	}



	//mapeia os valor da variavel com o numero de vezes que aparecem
	public Map<String,Double> occurrences(int varIndex) {
		Map<String,Double> result = new HashMap<>();
		for(String[] s : sets) {
			String curr = s[varIndex];
			Double nOccurrences = result.get(curr);
	
			if(nOccurrences == null) {	result.put(curr,1.0);
			} else { result.put(curr,nOccurrences+1); }
		}
		return result;
	}


	//mapeia os valor da variavel com uma Lista com os indices onde aparecem
	public Map<String,List<Integer>> occurrencesList(int varIndex) {
		Map<String,List<Integer>> result = new HashMap<>();
		for(int i=0; i<sets.size(); i++) {
			String[] s = sets.get(i);
			String curr = s[varIndex];
			List indexOccurrences = result.get(curr);
	
			if(indexOccurrences == null) { indexOccurrences = new LinkedList<>(); }	
			indexOccurrences.add(i);
			result.put(curr,indexOccurrences);
		}

		return result;
	}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------


	public void printDataTable() {
		String result = "[";
		for(int i=0; i< vars.length-1; i++) {
			result +=vars[i] + ", ";
		}
		result += vars[vars.length-1] + "]";
		System.out.println(result);
		for (String[] line : sets) {
			String s = "[";
			for(int i=0; i<line.length-1; i++) {
				s += line[i] + ", ";
			}
			s += line[line.length-1] + "]";
			System.out.println(s);
		}
	}

	public String toString() {
		String result = "[";
		for(int i=0; i< vars.length-1; i++) {
			result +=vars[i] + ", ";
		}
		result += vars[vars.length-1] + "]";
		return result;
	}
}


import java.util.*;

public class Algorithm {

	/*class dos nos da arvore
	curr = tabuleiro
	childs = filhos do no
	depth = altura
	value = valor heuristica do no
	cpuTurn = true se for a vez do jogador (devia de se chamar playerTurn)
	play = indice da coluna que a jogada que gerou do tab do no executou 

	*/
	class Node {
		private Board curr;
		private LinkedList<Node> childs;
		private int depth;
		private int value=0;
		private boolean cpuTurn;
		private int play =-1;

		Node(Board board, int depth, boolean turn) {
			curr = board;
			this.depth = depth;
			this.cpuTurn = turn;
			childs= new LinkedList<>();
		}

		public LinkedList<Node> getChilds() { return childs;}
		public int getDepth() { return depth;}
		public int getValue() { return value;}
		public Board getBoard() {return curr;}
		public boolean getTurn() { return cpuTurn; }
		public int getPlay() { return play; }

		public void setDepth(int d) { this.depth = d; }
		public void setValue(int v) { this.value = v; }
		public void addChild(Node child) { childs.add(child); }
		public void setTurn(boolean v) { this.cpuTurn = v; }
		public void setPlay(int v) { this.play = v; }

		public boolean isLeaf() { return childs.isEmpty(); }

	}

	//constroi a arvore de jogo com limite de profundidade
	private void construtTree(Node node, int depth) {
		LinkedList<Node> childs = generateChilds(node);
		for(Node son : childs) {
			node.addChild(son);
			//limite de profundidade
			if (node.getDepth()<depth)  {
				construtTree(son, depth);
			}
		}
	}
	
	// retorna a lista de possiveis moves dum estado do tabuleiro
	private LinkedList<Node> generateChilds(Node node) {
		Board board = node.getBoard();
		boolean turn = node.getTurn();
		int player;
		if(!turn) player = 2;
		else player = 1;
		LinkedList<Node> result = new LinkedList<>();
		for(int i=0; i<7; i++) {
			Board curr = new Board(board);
			if(curr.playMove(player, i)) {
				Node son = new Node(curr, node.getDepth()+1, !turn);
				result.add(son);
				son.setPlay(i);
			}
		}
		return result;
	}

	Algorithm() {}

	//funcao que prepara o algoritmo para a execucao do minmax a partir da raiz da arvore
	public int minMax(Board game, int depth){ 
		Node root = new Node(game, 0, false);                 //cria o no raiz e gera a arvore de pesquisa
		construtTree(root, depth);
		int bestValue = minMaxAux(root, depth, false);        //chamada do minmax
		LinkedList<Node> list = root.getChilds();
		for(Node n : list) {
			if(n.getValue()==bestValue) {
				return n.getPlay();
			}
		}
		return -1;
	}

	//minmax
	private int minMaxAux(Node n, int depth, boolean maximazingPlayer) {
		if(depth == 0) {
			n.setValue(n.getBoard().utility());
			return n.getBoard().utility();
		}
		if (maximazingPlayer) {
			LinkedList<Node> list = n.getChilds();
			int value = -9999;
			for(Node curr : list) {
				value = Math.max(value, minMaxAux(curr, depth-1, false));
				curr.setValue(value);
			}
			return value;
		}
		else {
			LinkedList<Node> list = n.getChilds();
			int value = 9999;
			for(Node curr : list) {
				value = Math.min(value, minMaxAux(curr, depth-1, true));
				curr.setValue(value);
			}
			return value;
		}	
	}

	//funcao que prepara o algoritmo para a execucao do alphabeta a partir da raiz da arvore
	public int alphaBeta(Board game, int depth) {
		Node root = new Node(game, 0, false);
		construtTree(root, depth);
		int bestValue = alphaBetaAux(root, depth, -9999, 9999, false);
		LinkedList<Node> list = root.getChilds();
		for(Node n : list) {
			if(n.getValue()==bestValue) {
				return n.getPlay();
			}
		}
		return -1;
	}

	//alphabeta
	private int alphaBetaAux(Node n, int depth, int alpha, int beta, boolean maximazingPlayer) {
		if(n.isLeaf() || depth==0) {
			n.setValue(n.getBoard().utility());
			return n.getBoard().utility();
		}

		if(maximazingPlayer) {
			LinkedList<Node> list = n.getChilds();
			int value = -9999;
			for(Node curr : list) {
				value = Math.max(value, alphaBetaAux(curr, depth-1, alpha, beta, false));
				curr.setValue(value);
				if(value >= beta) { break; }
				alpha = Math.max(alpha, value);
			}
			return value;
		}
		else {
			LinkedList<Node> list = n.getChilds();
			int value = 9999;
			for (Node curr : list) {
				value = Math.min(value, alphaBetaAux(curr, depth-1, alpha, beta, true));
				curr.setValue(value);
				if(value <= alpha) { break; }
				beta = Math.min(beta, value);
			}
			return value;
		}
	}

	//constroi a arvore de jogo sem limite de profundidade (nao é utilizada pq o fator limitante da execucao do algoritmo no meu pc e a criacao da arvore)
	private void construtTree(Node node) {
		LinkedList<Node> childs = generateChilds(node);
		for(Node son : childs) {
			node.addChild(son);
			//limite de profundidade
			construtTree(son);		
		}
	}


	//--------------------------------------------------------------------------------------------------------------------------------------------------------

	//class de nos da arvore de monte carlo
	class MCNode {

		private Board board;
		private MCNode father;
		private LinkedList<MCNode> childs;
		private int visit;
		private int tvalue;
		private boolean cpuTurn;
		private int play=-1;
	
		MCNode(Board game, boolean turn) {
			board = game;
			father = null;
			childs = new LinkedList<>();
			visit = 0; 
			tvalue = 0;
			cpuTurn = turn;
		}

		public Board getBoard() { return board; }
		public MCNode getFather() { return father; }
		public LinkedList<MCNode> getChilds() { return childs; }
		public int  getVisit() { return visit; }
		public int getTvalue() { return tvalue; }
		public boolean getTurn() { return cpuTurn; }
		public int getPlay() { return play; }
		public MCNode getFirstChild() { return childs.getFirst();}

		public void setBoard(Board x) { this.board=x; }
		public void setFather(MCNode x) { this.father=x; }
		public void addChild(MCNode x) { this.childs.add(x); }
		public void wasVisit() { this.visit++; }
		public void setTvalue(int x) { this.tvalue=x; }
		public void setTurn(boolean x) { this.cpuTurn=x; }
		public void setPlay(int x) { this.play=x; }

		public boolean isLeaf() { return childs.isEmpty(); }
		public boolean isFinal() {
			int player;
			if(!cpuTurn) player = 2;
			else player = 1;
			return !this.board.canPlay() || this.board.isSolution(player, play);
		}
	}


	//algoritmo montecarlo que corre xtimes vezes
	public int monteCarloTS(Board game, int xtimes) {
		MCNode root = new MCNode(game, false);
		generateChilds(root);                   //cria o no raiz e gera arvore de pesquisa de tamanho minimo (altura = 1)

		for(int i=0; i<xtimes; i++) {
			MCNode leaf = traverse(root);        //percorre a arvore e retorna o no com melhor UCB
			int simulationResult = rollout(leaf);  //simula arvore a partir do no anterior e retorna o valor heuristico do no final
			backpropagate(leaf, simulationResult); //propaga o resultado anterior para o resto da arvore

		}
		return 0;		
	}



	//-----------------------------backpropagate----------------------------------------------
	private void backpropagate(MCNode leaf, int result) {
		while (leaf.getFather() != null) {
			leaf.wasVisit();
			leaf.setTvalue(leaf.getTvalue()+result);
			leaf = leaf.getFather();
		}
	}



	//-----------------------------rollout----------------------------------------------------
	private int rollout(MCNode n) {
		while (!n.isFinal()) {       
			n = rolloutPolicy(n);
		}
		return n.getBoard().utility();
	}

	//gera novas jogadas random ate se chegar a um estado de tabuleiro final
	private MCNode rolloutPolicy(MCNode n) {
		Random ran = new Random();
		int x = ran.nextInt(6);
		int player;
		if(n.getTurn()) player = 2;
		else player = 1;
		Board result = new Board(n.getBoard());
		while (!result.playMove(player,x)) {
			x = ran.nextInt(6);
		}
		MCNode r = new MCNode(result, !n.getTurn());
		r.setPlay(x);
		return r;
	}

	//----------------------------traverse--------------------------------------------------
	private MCNode traverse(MCNode n) {
		if(n.isLeaf()){
			return prepRollout(n);
		} 
		LinkedList<MCNode> list = n.getChilds();
		double ucbval = -9999;
		MCNode child = n;
		for(MCNode curr : list) {
			if (uCBValue(curr)> ucbval) {
				ucbval = uCBValue(curr);
				child = curr;
			}
		}
		return traverse(child);

	}

	//verifica se o no ja foi visitado ou nao (se for gera novo ramo da arvore e retorna o primeiro filho)
	private MCNode prepRollout(MCNode n) {
		if (n.getVisit()==0) { return n; }		
		generateChilds(n);
		return n.getFirstChild();

	}

	//calcula os UCB value do node
	private double uCBValue(MCNode n) {
		if(n.getVisit()==0) { return 9999;}
		return n.getTvalue() + 2*Math.sqrt(Math.log(n.getFather().getVisit()) / n.getVisit());

	}

	// gera os MCnodes filho consoante as possibilidades de jogadas no tabuleiro
	private void generateChilds(MCNode node) {
		Board board = node.getBoard();
		boolean turn = node.getTurn();
		int player;
		if(!turn) player = 2;
		else player = 1;
		for(int i=0; i<7; i++) {
			Board curr = new Board(board);
			if(curr.playMove(player, i)) {
				MCNode son = new MCNode(curr, !turn);
				node.addChild(son);
				son.setFather(node);
				son.setPlay(i);
			}
		}
	}

}
import java.util.*;

public class Board{

	private char[][] table;

	Board() {
		table = new char[6][7];
		for (int i=0; i<6; i++) {
			for (int j=0; j<7; j++) {
				table[i][j] = '-';
			}
		}
	}

	//metodo para criar um tabuleiro igual ao tabuleiro forncido (ideal para quando se quer copias de tabuleiros)
	Board(Board t) {
		table = new char[6][7];
		char[][] curr = t.getTable();
		for (int i=0; i<6; i++) {
			for (int j=0; j<7; j++) {
				table[i][j] = curr[i][j];
			}
		}
	}


	public char[][] getTable() { return table;}
	
	//funcao de jogo retorna true se jogada for possivel
	public boolean playMove(int player, int x) {
		char piece;
		if (player == 1) piece = 'X';
		else piece = 'O';

		for(int i=5; i>=0; i--) {
			if(table[i][x] == '-') {
				table[i][x] = piece;
				return true;
			}
		}
		return false;
	}


	//funcao testa se a jogada deu um tabuleiro solucao
	public boolean isSolution(int player, int column) {
		char piece;
		if (player == 1) piece = 'X';
		else piece = 'O';

		int row=0;
		for(int i=0; i<6; i++) {
			if(table[i][column] == piece) {
				row = i; 
				break;
			}
		}
		boolean result =
			checkDown(row, column, piece)  ||
			checkSides(row, column, piece) ||
			checkDiagonal(row, column, piece)  ||
			checkOtherDiagonal(row, column, piece);

		return result;	
	}


	//FUNCOES AUXILIARES PARA A IS_SOLUTION---------------------------------------
	//ver baixo
	private boolean checkDown(int row, int column, char target) {
		if (row>2) { return false; }
		for(int i=1; i<=3; i++) {
			if (table[row+i][column] != target) { return false;}
		}
		return true;
	}
    
    //ver lados
	private boolean checkSides(int row, int column, char target) {
		int count = countLeft(row, column, target);
		if (count >= 3) return true;
		count += countRight(row, column, target);
		if (count >= 3) return true;
		return false;
	}

	private int countLeft(int row, int column, char target) {
		int count=0;
		column--;
		while(column>=0) {
			if(table[row][column]== target) count++;
			else break;
			column--;
		}
		return count;
	}

	private int countRight(int row, int column, char target) {
		int count=0;
		column++;
		while(column<=6) {
			if(table[row][column]==target) count++;
			else break;
			column++;
		}
		return count;
	}

	//ver uma diagonal
	private boolean checkDiagonal(int row, int column, char target) {
		int count = countLeftDown(row, column, target);
		if (count >= 3) return true;
		count += countRightUp(row, column, target);
		if (count >= 3) return true;
		return false;
	}

	private int countLeftDown(int row, int column, char target) {
		int count=0;
		column--;
		row++;
		while(column<7 && row<6 && column>=0 && row >=0) {
			if(table[row][column]==target) count++;
			else break;
			column--;
			row++;
		}
		return count;
	}

	private int countRightUp(int row, int column, char target) {
		int count=0;
		column++;
		row--;
		while(column<7 && row<6 && column>=0 && row >=0) {
			if(table[row][column]==target) count++;
			else break;
			column++;
			row--;
		}
		return count;
	}

	//ver a outra diagonal
	private boolean checkOtherDiagonal(int row, int column, char target) {	
		int count = countLeftUp(row, column, target);
		if (count>=3) return true;
		count += countRightDown(row, column, target);
		if (count>=3) return true;
		return false;

	}	

	private int countLeftUp(int row, int column, char target) {
		int count=0;
		column--;
		row--;
		while(column>=0 && row>=0 && column<7 && row<6) {
			if(table[row][column]==target) count++;
			else break;
			column--;
			row--;
		}
		return count;
	}

	private int countRightDown(int row, int column, char target) {	
 		int count=0;
 		column++;
 		row++;
 		while(column<7 && row<6 && column>=0 && row >=0) {
 			if(table[row][column]==target) count++;
 			else break;
 			column++;
 			row++;
 		}
 		return count;
 	}
 	//---------------------------------------------------------


 	//funcao testa se o tabuleiro esta totalmente preenchido
 	public boolean canPlay() {
 		for(int i=0; i<7; i++) 
 			if(table[0][i]=='-') { return true; }
 		return false;
 	}


 	//funcao auxiliar de utility
	private int points(int x, int o) {
		if (x == 4)
		  return 512;
		if (o == 4)
		  return -512;
		if (x > 0 && o > 0)
		  return 0;
		if (x == 1)
		  return 1;
		if (x == 2)
		  return 10;
		if (x == 3)
		  return 50;
		if (o == 1)
		  return -1;
		if (o == 2)
		  return -10;
		if (o == 3)
		  return -50;
		return 0;
	}	

 	//funcao de avaliacao do estado do tabuleiro
 	public int utility() {
 		int x=0;
 		int o=0;
 		int sum=0;

 		//linhas 
 		for(int i=0; i<6; i++) {
 			for(int j=0; j<4; j++){
 				for(int k=0; k<4; k++) {
 					if(table[i][j+k]=='X')
 						x++;
 					if(table[i][j+k]=='O')
 						o++;
 				}
 				int p = points(x,o);
 				x=0;
 				o=0;
 				if(p==512 || p==-512) 
 					return p;
 				sum += p;
 			}
 		}
 		//System.out.println("Score for Lines: " + sum);
 		int lines = sum;

 		//colunas
 		for(int j=0; j<7; j++) {
 			for(int i=0; i<3; i++) {
 				for(int k=0; k<4; k++) {
 					if (table[i+k][j]=='X')
 						x++;
 					if (table[i+k][j]=='O')
 						o++;					
 				}
 				int p = points(x,o);
 				x=0;
 				o=0;
 				if(p==512 || p==-512) 
 					return p;
 				sum += p;
 			}
 		}
 		//System.out.println("Score for Columns: " + (sum-lines));

 		//diagonais
 		//System.out.println("Indice of diagonals");
 		//main diagonal
 		for(int i=0; i<3; i++) {
 			for(int j=0; j<4; j++) {
 				for(int k=0; k<4; k++) {
 					if (table[i+k][j+k]=='X')
 						x++;
 					if (table[i+k][j+k]=='O')
 						o++;
 					//System.out.println("(" + (i+k) + "," + (j+k) + ")");
 				}
 				//System.out.println("===========");
 				int p = points(x,o);
 				x=0;
 				o=0;
 				if(p==512 || p==-512) 
 					return p;
 				sum += p;
 			}
 		}
 		//other diagonal
 		for(int i=0; i<3; i++) {
 			for(int j=3; j<7; j++) {
 				for (int k=0; k<4; k++) {
 					if (table[i+k][j-k]=='X')
 						x++;
 					if (table[i+k][j-k]=='O')
 						o++;
 					//System.out.println("(" + (i+k) + "," + (j-k) + ")");
 				}
 				//System.out.println("===========");
 				int p = points(x,o);
 				x=0;
 				o=0;
 				if(p==512 || p==-512) 
 					return p;
 				sum += p;
 			}
 		}
 		return sum;
 	}

 	//desenha o tabuleiro na shell
	public void printBoard() {
		String anwer = "";
		for (char[] i : table)
			System.out.println(i);
	}


}
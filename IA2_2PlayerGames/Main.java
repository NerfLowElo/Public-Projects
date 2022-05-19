import java.util.*;

public class Main{

	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);

		Board game = new Board();
		Algorithm al = new Algorithm();
		
		game.printBoard();
		System.out.println("It is now X’s turn.");
		System.out.println("Make a move by choosing the column you want to play (0-6).");

		int move;
		while (true){
			move = in.nextInt();
			
			if (move<0 || move>6) {
				System.out.println("Illegal Move!");
				System.out.println("Make a move by choosing the column you want to play (0-6).");
				continue;
			}
			if (!game.playMove(1,move)) {
				System.out.println("Illegal Move!");
				System.out.println("Make a move by choosing the column you want to play (0-6).");
				continue;
			}
			
			if(game.isSolution(1,move)){
				game.printBoard();
				System.out.println("Congrats! You Won!");
				break;
			}

			//COMENTAR/DESCOMENTAR CONSOANTE O ALGORITMO DESEJADO. O INTEIRO DENOMINA A ALTURA DA ARVORE DE PESQUISA(minmax e alphabeta) E O Nº DE CICLOS(monte carlos)
			int x = al.minmax(game, 6);
			//int x = al.alphaBeta(game, 6);
			//int x = al.monteCarloTS(game, 6);


			game.playMove(2,x);
			if(game.isSolution(2,x)){
				game.printBoard();
				System.out.println("You Lost! :(");
				break;
			}

			game.printBoard();
			System.out.println("It is now X’s turn.");
			System.out.println("Make a move by choosing the column you want to play (0-6).");
		}
	
		/*
		game.playMove(1,0);
		game.playMove(2,1);
		game.playMove(1,2);
		game.playMove(2,3);
		game.playMove(1,4);
		game.playMove(2,1);
		game.playMove(1,2);
		game.playMove(2,4);
		game.playMove(1,3);
		game.playMove(2,4);
		game.playMove(1,1);
		game.playMove(1,1);
		game.playMove(2,3);
		game.playMove(1,2);
		game.printBoard();
		//System.out.println(game.isSolution(1,3));
		System.out.println(game.utility());	*/	
	}
}
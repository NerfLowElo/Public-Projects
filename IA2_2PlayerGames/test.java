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
			
			Random ran = new Random();
			int x = ran.nextInt(6);
			game.playMove(2,x);
			if(game.isSolution(2,x)){
				game.printBoard();
				System.out.println("You Lost! :(");
				break;
			}

			game.printBoard();
			System.out.println("It is now X’s turn.");
			System.out.println("Make a move by choosing the column you want to play (0-6).
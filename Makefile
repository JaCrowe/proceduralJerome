all: main.o
	g++ main.o -o sfml-app -lsfml-graphics -lsfml-window -lsfml-system

assemble: 
	g++ -c main.cpp
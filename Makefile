all: main.o
	g++ main.o -o procedural_jerome -lsfml-graphics -lsfml-window -lsfml-system

assemble: 
	g++ -c main.cpp

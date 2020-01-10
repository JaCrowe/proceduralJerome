all: main.o
	g++ main.o -o shadertown -lsfml-graphics -lsfml-window -lsfml-system

assemble: 
	g++ -c main.cpp

all:
	g++ src/main.cpp src/pjfile.cpp src/pjshader.cpp src/pjmanager.cpp -o procedural_jerome -lSDL2 -lGLEW -lGLU -lGL


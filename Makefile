all:
	g++ src/main.cpp src/pjfile.cpp src/pjshader.cpp src/pjmanager.cpp src/pjgeometry.cpp -o procedural_jerome -lSDL2 -lSDL2_image -lGLEW -lGLU -lGL -I /usr/include/ffmpeg/


all:
	g++ src/main.cpp \
		src/pjfile.cpp \
		src/pjshader.cpp \
		src/pjmanager.cpp \
		src/pjgeometry.cpp \
		-o procedural_jerome \
		-ljack -lSDL2 -lSDL2_image -lGL
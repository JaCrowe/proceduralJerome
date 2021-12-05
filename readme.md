# proceduralJerome

_WARNING_ If you came here for clean, properly architected code you've come to the WRONG place. Once I'm happy with the features I've implemented I want to tidy this up and make it code that can be followed for educational purposes.


To put it simply, you're looking at a very watered down desktop version of [ShaderToy](https://www.shadertoy.com/) with the ability to save the frames to image, and a crappy little shell script to assemble video with FFMpeg. I will continue to optimize this program to allow me to generate seamless animated loops. My first priority is generating art with this program. If my art gains traction and I get eyes on this repo I'll commit to cleaning it up / commenting it for others to follow.


## Running

The program is hard coded to run my one hit wonder (the diamond lattice animation).

```bash
./procedural_jerome
```

In the slow evolution towards a program actually usable by non-devs/devs without context
the program may now take in the fragment shader you would like to render as an argument

```bash
./procedural_jerome shaders/chip_chomper.frag
```

## Build Instructions

#### Dependencies

On Ubuntu 21
- libsdl2-dev
- libsdl2-image-dev
- libavcodec-dev
- libswscale-dev

The OpenGL dependencies will be installed with libsdl. 

### Compilation

Assuming you're running on Linux

```bash
make
```

If you're developing on mac this will probably work. If you're stuck developing on windows then I'm sorry.

## A word on the road map

If you have a clue what's going on here you may be asking yourself "why the hell is he writing a program to render shaders when plenty already exist???", which is a valid question to ask. Before I commit to a campaign of tidiness I want to implement the following features

- Add comprehensive support for command line arguments including options to configure
    * Whether screenshots should be saved
    * Period of animated loop, in frames
        * Alternatives, audio file to match animated loop time to
- Intregation of a [JACK](https://jackaudio.org/) client for a live visualizer mode
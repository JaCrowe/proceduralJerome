#include "pjaudiofile.h"
#include <string>
#include <iostream>
#include <fstream>
#include <SDL2/SDL.h>
#include <fftw3.h>
#define AUDIO_FRAME_BIT_DEPTH 8
using namespace std;

double getWavRunLength(SDL_AudioSpec wav_spec, Uint32 wav_length)
{
    return double(wav_length) / double(wav_spec.freq) / double(wav_spec.channels) / (double(SDL_AUDIO_BITSIZE(wav_spec.format)) / double(AUDIO_FRAME_BIT_DEPTH));
}

std::string PJAudioFile::getFileContents(ifstream &file)
{
    if (!file.good())
        return 0;
    string contents = "";
    string line;
    while (std::getline(file, line))
    {
        contents += line;
        contents += "\n";
    }
    unsigned long pos = file.tellg();
    file.seekg(0, ios::end);
    unsigned long len = file.tellg();
    file.seekg(ios::beg);
    return contents;
}

int PJAudioFile::loadfile(const char *filename)
{

    SDL_AudioSpec wav_spec;
    Uint32 wav_length;
    Uint8 *wav_buffer;

    /* Load the WAV */
    if (SDL_LoadWAV(filename, &wav_spec, &wav_buffer, &wav_length) == NULL)
    {
        fprintf(stderr, "Could not open test.wav: %s\n", SDL_GetError());
        return 1;
    }
    else
    {
        /* Do stuff with the WAV data, and then... */
        printf(
            "Length of audio is: %f\n",
            getWavRunLength(wav_spec, wav_length));

        SDL_FreeWAV(wav_buffer);
        return 0;
    }
}

PJAudioFile::PJAudioFile(const char *_file_path)
{
    file_path = _file_path;
    loadfile(file_path);
}
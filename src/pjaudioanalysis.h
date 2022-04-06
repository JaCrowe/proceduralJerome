#ifndef PJ_AudioAnalysis
#define PJ_AudioAnalysis
#include <SDL2/SDL.h>
#include "vector"

class PJAudioAnalysis
{
public:
    PJAudioAnalysis(Uint8 *wav_buffer, int signalLength);
    // void STFT(std::vector<float> *signal, int signalLength, int windowSize, int hopSize);
    void STFT(Uint8 *signal, int signalLength, int windowSize, int hopSize);
};

#endif

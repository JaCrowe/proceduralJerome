#include "pjaudioanalysis.h"
#include <fftw3.h>
#include <iostream>
#include "vector"
#include "math.h"
#define PI M_PI
using namespace std;

PJAudioAnalysis::PJAudioAnalysis(Uint8 *wav_buffer, int signalLength)
{
    cout << "I am alive lol" << endl;
    STFT(wav_buffer, signalLength, 2048, 128);
    cout << "I FUCKIN DID IT" << endl;
}

// --- Liam Neeson'd from http://ofdsp.blogspot.com/2011/08/short-time-fourier-transform-with-fftw3.html
// Create a hamming window of windowLength samples in buffer
void hamming(int windowLength, float *buffer)
{

    for (int i = 0; i < windowLength; i++)
    {

        buffer[i] = 0.54 - (0.46 * cos(2 * PI * (i / ((windowLength - 1) * 1.0))));
    }
}

// void PJAudioAnalysis::STFT(std::vector<float> *signal, int signalLength, int windowSize, int hopSize)
void PJAudioAnalysis::STFT(Uint8 *signal, int signalLength, int windowSize, int hopSize)
{

    fftw_complex *data, *fft_result, *ifft_result;
    fftw_plan plan_forward, plan_backward;
    int i;

    data = (fftw_complex *)fftw_malloc(sizeof(fftw_complex) * windowSize);
    fft_result = (fftw_complex *)fftw_malloc(sizeof(fftw_complex) * windowSize);
    ifft_result = (fftw_complex *)fftw_malloc(sizeof(fftw_complex) * windowSize);

    plan_forward = fftw_plan_dft_1d(windowSize, data, fft_result, FFTW_FORWARD, FFTW_ESTIMATE);

    // Create a hamming window of appropriate length
    float window[windowSize];
    hamming(windowSize, window);

    int chunkPosition = 0;

    int readIndex;

    // Should we stop reading in chunks?
    int bStop = 0;

    int numChunks = 0;

    // Process each chunk of the signal
    while (chunkPosition < signalLength && !bStop)
    {

        // Copy the chunk into our buffer
        for (i = 0; i < windowSize; i++)
        {

            readIndex = chunkPosition + i;

            if (readIndex < signalLength)
            {

                // Note the windowing!
                data[i][0] = float(signal[readIndex]) * window[i];
                data[i][1] = 0.0;
            }
            else
            {

                // we have read beyond the signal, so zero-pad it!

                data[i][0] = 0.0;
                data[i][1] = 0.0;

                bStop = 1;
            }
        }

        // Perform the FFT on our chunk
        fftw_execute(plan_forward);

        //  Uncomment to see the raw-data output from the FFT calculation
        // std::cout << "Column: " << chunkPosition << std::endl;
        // for (i = 0; i < windowSize; i++)
        // {
        //     fprintf(stdout, "fft_result[%d] = { %2.2f, %2.2f }\n",
        //             i, fft_result[i][0], fft_result[i][1]);
        // }

        // Copy the first (windowSize/2 + 1) data points into your spectrogram.
        // We do this because the FFT output is mirrored about the nyquist
        // frequency, so the second half of the data is redundant. This is how
        // Matlab's spectrogram routine works.

        // for (i = 0; i < windowSize / 2 + 1; i++)
        // {
        //     yourDataStructureGoesHere = fft_result[i][0];
        //     yourDataStructureGoesHere = fft_result[i][1];
        // }

        chunkPosition += hopSize;
        numChunks++;

    } // Excuse the formatting, the while ends here.

    fftw_destroy_plan(plan_forward);

    fftw_free(data);
    fftw_free(fft_result);
    fftw_free(ifft_result);
}

// --- End dirty thieving zone
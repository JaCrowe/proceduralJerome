#include <SFML/Graphics.hpp>
#include <math.h>
#include <iostream>
#include <string>

#define PI 3.14159265

int main(int argc, char **argv)
{

    const float width = 800;
    const float height = 800;

    const std::string fragmentShader = "shaders/fragment_periodic.frag";
    const std::string fragmentShader1 = "shaders/fragment_firstpost.frag";
    const std::string vertexShader = "shaders/vertex_shader.vert";

    sf::RenderWindow window(sf::VideoMode(width, height), "Shader Town");
    sf::Clock clock;
    sf::Shader shader;
    sf::Shader shader_1;

    sf::RenderTexture pass_0;
    sf::RenderTexture pass_1;
    sf::RenderTexture pass_2;

    pass_0.create(width, height);
    pass_1.create(width, height);
    // --- Load the shaders

    if (!shader.loadFromFile(vertexShader, fragmentShader))
    {
        std::cout << "Failed to load vertex and fragment shaders";
        return 0;
    }

    if (!shader_1.loadFromFile(vertexShader, fragmentShader1))
    {
        std::cout << "Failed to load vertex and fragment shaders";
        return 0;
    }

    // -- Set uniforms

    sf::Time elapsed1;
    float time = elapsed1.asMicroseconds() / 1.000000;

    shader.setUniform("iTime", time);
    shader.setUniform("iResolution", sf::Vector2f(width, height));
    // shader.setUniform("iMouse", sf::Vector2f(width / 2., height / 2.));

    sf::Texture meowTex;
    if (!meowTex.loadFromFile("img/meow.png"))
    {

        return 0;
        // error...
    }

    shader.setUniform("meowTex", meowTex);

    // -- Setup loop
    const int n_frames = 30 * 20.0;
    const bool saveFile = false;

    const int frameSkip = 1.0;

    int frameCount = 0;
    bool condition = true;
    sf::Texture dingDong;
    sf::Texture bongDongPeep0;
    sf::Texture horseCombiner;

    sf::Texture bongDongPeep;
    sf::RectangleShape shape;
    shape.setSize(sf::Vector2f(width, height));

    while (condition)
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        for (int i = 0; i < frameSkip; i++)
        {
            float time = frameCount / 60.; // elapsed1.asS() / 10000000;

            // shader.setUniform("iTime", time + float(i) * float(100.));
            shader.setUniform("iTime", time);
            pass_0.clear();
            pass_0.draw(shape, &shader);
            dingDong = pass_0.getTexture();
            shader_1.setUniform("texture", dingDong);
            shader_1.setUniform("previous", horseCombiner);
            pass_1.draw(shape, &shader_1);
            horseCombiner = pass_1.getTexture();
            frameCount++;
        }

        window.draw(sf::Sprite(horseCombiner));

        window.display();
        condition = window.isOpen();
        // frameCount++;

        if (saveFile)
        {
            char fName[50];
            sprintf(fName, "out/capture_%03d.png", frameCount / frameSkip);
            sf::Image screenshot = horseCombiner.copyToImage();
            screenshot.saveToFile(fName);

            condition = frameCount / frameSkip < n_frames;
        }
    }

    return 0;
}

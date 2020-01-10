#include <SFML/Graphics.hpp>
#include <math.h>
#include <iostream>
#include <string>
#include "cxxopts.hpp"

#define PI 3.14159265

cxxopts::ParseResult parse(int argc, char *argv[])
{
    try
    {
        cxxopts::Options options("ShaderTown", "Broken software to make Jeremy's animations");
        options
            .positional_help("[optional args]")
            .show_positional_help();

        options
            .allow_unrecognised_options()
            .add_options()("s,save", "Save", cxxopts::value<bool>()->default_value("false"))("vshader", "Vertex Shader", cxxopts::value<std::string>()->default_value("shaders/vertex_shader.vert"));

        auto result = options.parse(argc, argv);
        return result;
    }
    catch (const cxxopts::OptionException &e)
    {
        std::cout << "error parsing options: " << e.what() << std::endl;
        exit(1);
    }
}

int main(int argc, char **argv)
{
    auto result = parse(argc, argv);

    if (result["save"].as<bool>())
    {
        std::cout << "You told me to SAAAAAAAVE!?!?";
    }

    std::cout << "Vertex shader is: " + result["vshader"].as<std::string>();

    const float width = 800;
    const float height = 800;

    const std::string fragmentShader = "shaders/fragment_diffuse.frag";
    const std::string fragmentShader1 = "shaders/fragment_normal.frag";
    const std::string fragmentShader2 = "shaders/fragment_normal_warp.frag";
    const std::string vertexShader = "shaders/vertex_shader.vert";

    sf::RenderWindow window(sf::VideoMode(width, height), "Shader Town");

    sf::Shader shader_0;
    sf::Shader shader_1;
    sf::Shader shader_2;

    sf::RenderTexture pass_0;
    sf::RenderTexture pass_1;
    sf::RenderTexture pass_2;

    pass_0.create(width, height);
    pass_1.create(width, height);
    pass_2.create(width, height);
    // --- Load the shaders

    if (!shader_0.loadFromFile(vertexShader, fragmentShader))
    {
        std::cout << "Failed to load vertex and fragment shaders";
        return 0;
    }

    if (!shader_1.loadFromFile(vertexShader, fragmentShader1))
    {
        std::cout << "Failed to load vertex and fragment shaders";
        return 0;
    }

    if (!shader_2.loadFromFile(vertexShader, fragmentShader2))
    {
        std::cout << "Failed to load vertex and fragment shaders";
        return 0;
    }

    // -- Set uniforms
    float time = 0;

    shader_0.setUniform("iTime", time);
    shader_0.setUniform("iResolution", sf::Vector2f(width, height));
    shader_1.setUniform("iResolution", sf::Vector2f(width, height));

    shader_2.setUniform("iResolution", sf::Vector2f(width, height));

    /*
    sf::Texture imageTexture;
    if (!imageTexture.loadFromFile("img/dot.png")){return 0;}
    */

    // shader_0.setUniform("meowTex", meowTex);

    // -- Setup loop
    const int n_frames = 30 * 20.0;
    const int frameSkip = 1.0;

    int frameCount = 0;
    bool condition = true;
    sf::Texture passTexture;
    sf::Texture pass1Texture;
    sf::Texture finalTexture;

    sf::Texture imageTexture;
    if (!imageTexture.loadFromFile("img/pexels-fire.png"))
    {
        return 0;
    }

    sf::Texture persistentTexture;
    if (!persistentTexture.loadFromFile("img/junk.png"))
    {
        return 0;
    }

    shader_2.setUniform("imageTexture", imageTexture);

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

        float time = frameCount / 60.;

        // persistentTexture
        shader_0.setUniform("texture", persistentTexture);
        shader_0.setUniform("iTime", time);
        pass_0.clear();
        pass_0.draw(shape, &shader_0);
        /*
            passTexture = pass_0.getTexture();
            shader_1.setUniform("texture", passTexture);
            shader_1.setUniform("previous", finalTexture);
            pass_1.draw(shape, &shader_1);
            finalTexture = pass_1.getTexture();
            */
        persistentTexture = pass_0.getTexture();

        shader_1.setUniform("texture", persistentTexture);
        pass_1.draw(shape, &shader_1);
        pass1Texture = pass_1.getTexture();

        shader_2.setUniform("iTime", time);
        shader_2.setUniform("normalTexture", pass1Texture);
        pass_2.clear();
        pass_2.draw(shape, &shader_2);
        finalTexture = pass_2.getTexture();
        // finalTexture = persistentTexture;

        frameCount++;

        /*
        for (int i = 0; i < frameSkip; i++)
        {
            float time = frameCount / 60.;

            shader_0.setUniform("iTime", time);
            pass_0.clear();
            pass_0.draw(shape, &shader_0);
            
            passTexture = pass_0.getTexture();
            shader_1.setUniform("texture", passTexture);
            shader_1.setUniform("previous", finalTexture);
            pass_1.draw(shape, &shader_1);
            finalTexture = pass_1.getTexture();
            
            finalTexture = pass_0.getTexture();
            frameCount++;
        }*/

        window.draw(sf::Sprite(finalTexture));

        window.display();
        condition = window.isOpen();

        if (result["save"].as<bool>())
        {
            char fName[50];
            sprintf(fName, "out/capture_%03d.png", frameCount / frameSkip);
            sf::Image screenshot = finalTexture.copyToImage();
            screenshot.saveToFile(fName);
            condition = frameCount / frameSkip < n_frames;
        }
    }

    return 0;
}

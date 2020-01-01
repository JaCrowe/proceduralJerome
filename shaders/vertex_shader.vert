void main()
    {
    // transform the vertex position
    vec4 position = gl_Vertex;
    // position.x = position.x + 50.0*sin(position.y);
    gl_Position = gl_ModelViewProjectionMatrix * position;
};
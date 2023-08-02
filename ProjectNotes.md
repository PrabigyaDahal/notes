To create this app. I needed to add few dependencies. 
React-mde would not work with the version of react I was running. So, had to force install it.
Using: npm install readce-mde --legacy-peer-deps. This code overlooks dependency tree hence allowed me to import react mde and add it as a dependency.
Also after that the css for mde would not work. There is a separate link to CSS file in Editor.js for the CSS to work.
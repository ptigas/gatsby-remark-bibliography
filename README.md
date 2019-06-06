# gatsby-remark-bibliography

gatsby-remark-bibliography adds bibtex to gatsby. Inspired and reused code from http://distill.pub.

## Usage


Add a `bibliography` tag inside your markdown e.g.
```
<bibliography>
@article{gregor2015draw,
    title={DRAW: A recurrent neural network for image generation},
    author={Gregor, Karol and Danihelka, Ivo and Graves, Alex and Rezende, Danilo Jimenez and Wierstra, Daan},
    journal={arXivreprint arXiv:1502.04623},
    year={2015},
    url={https://arxiv.org/pdf/1502.04623.pdf},
}
</bibliography>
```

and reference it using `\cite{gregor2015draw}`. This will get transformed to a citation `[n]` and a bibliography list at the place of `bibliography` tag.

## Install

`npm install --save gatsby-transformer-remark gatsby-remark-bibliography bibtex-parse-js`

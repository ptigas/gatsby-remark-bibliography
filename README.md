# gatsby-remark-bibliography

gatsby-remark-bibliography adds bibtex to gatsby. Inspired by and reused code from http://distill.pub.

![bibtex](https://user-images.githubusercontent.com/208803/59069825-539e0f80-88b0-11e9-85cf-060d515c345b.gif)

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

### MDX Usage

Unfortunatelly mdx doesn't like `<bibliography>` tags. Instead you should use `@@bibliography`. e.g:

```
@@bibliography@@
@article{goyal2019infobot,
  title={InfoBot: Transfer and Exploration via the Information Bottleneck},
  author={Goyal, Anirudh and Islam, Riashat and Strouse, Daniel and Ahmed, Zafarali and Botvinick, Matthew and Larochelle, Hugo and Levine, Sergey and Bengio, Yoshua},
  journal={arXiv preprint arXiv:1901.10902},
  year={2019}
}
@article{kottur2017natural,
  title={Natural Language Does Not Emerge Naturally in Multi-Agent Dialog},
  author={Kottur, Satwik and Moura, Jos{\'e} MF and Lee, Stefan and Batra, Dhruv},
  journal={arXiv preprint arXiv:1706.08502},
  year={2017}
}
@article{jaques2018intrinsic,
  title={Intrinsic social motivation via causal influence in multi-agent RL},
  author={Jaques, Natasha and Lazaridou, Angeliki and Hughes, Edward and Gulcehre, Caglar and Ortega, Pedro A and Strouse, DJ and Leibo, Joel Z and de Freitas, Nando},
  journal={arXiv preprint arXiv:1810.08647},
  year={2018}
}
@book{lewis1968convention,
  title={Convention: A philosophical study},
  author={Lewis, David},
  year={1968}
}
@@bibliography@@
```

## Install

`npm install --save gatsby-transformer-remark gatsby-remark-bibliography bibtex-parse-js`

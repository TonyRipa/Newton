
Newton: An A.I. for Math
========================

Author : Anthony John Ripa

Date : 2018.12.10

Live Demo at <a target='_blank' href='http://tonyripa.github.io/Newton/'>http://tonyripa.github.io/Newton/</a>


Task Definition: Expression Recognition
-------------------------------------------
Mathematical expressions are typically simplified using domain-specific algorithms (algebra).  The goal is to replace this domain-specific knowledge, with machine learning.  Ideally, it would simplify better than domain-specific algorithms.

Motivation: Inadequate Algorithms
-----------------------------------
The motivating example is the expression ((2+h)^2-2^2)/h for secant lines of f(x)=x^2 through the point x=2.  Classical simplification yields a line with a hole in it: 4+h if h!=0 else undefined.  If you want the tangent (h=0) the result is undefined.  The line should not have a hole.

Goal: Noise-free Approach
----------------------------
Rather than answers with holes and post-hoc fix with calculus, make a system that reasons smoothly and gets it right the first time.  Machine learning uses reasonable hypothesis spaces and gives reasonable answers.  Sampling and smoothing is the way.

Evaluation Setup
---------------------
Evaluation is done by entering in different expressions for `Newton` to recognize (simplify).  Simple expressions like 1, x/x, x, x+1, (x+1)^2, to harder expressions like (x-1)/(x^2-1), x+h, and even the centerpiece of calculus the difference quotient ((x+h)^2-x^2)/h|0.

Results
--------------
`Newton` solves the motivating problems. More importantly, it does so without resort to domain-specific approaches (algebra, calculus or limits).  Smoothing (a machine learning concept of broad applicability) does the same thing, without having to resort to domain-specific reasoning.

Analysis
-------------
The hypothesis space is polynomial and rational functions.  The system works well when the expression is reducible to this form.  Round-off errors are possible.  The system currently uses floating point computation.  Switching to rational numbers would fix this.

Conclusion: Smoothing not Limits
-------------------------------------
`Newton` solves algebraic problems without reliance on domain-specific algorithms. `Newton` does not make the classical algorithm mistake of concluding ((2+h)^2 – 2^2)/h is (4+h if h!=0 else undefined) and instead returns the smooth solution 4+h. `Newton`'s approach to algebra is clean enough to answer questions which would otherwise require a needlessly complicated workaround like calculus.

Extensions
--------------
`Newton`'s power to recognize functions other than rational functions (like transcendental functions) can be extended by preprocessing the data with a transform that maps a larger space of functions into rational functions. `Newton` can then recognize that rational function. These are in a sense spectacles for Newton. By introducing an optional Laplace-like preprocessing step, `Newton` can recognize a larger class of functions. A possible downside is that it is a bit numerically expensive because it is an integral transform.

Complementarily, `Newton` can also do an optional differential transform. The differential transform has 2 advantages. One is that it is cheaper to calculate. Two is that it is all-in-one instead of preprocessing. This transform is again Laplace-like. It comes from the observation that the Taylor coefficients without factorial denominators (basically just the derivatives) can be put into (possibly repeating) sequence expansion .f(0)f'(0)f''(0)f'''(0) , and that this sequence is the Laplace transform , which `Newton` can put into fraction-form to look more Laplace-like , since the expansion is a relatively untraditional form . Another (although not necessarily the best) way of looking at this (for those who are already familiar with generating functions) is that the Laplace-Transform is the Generating Function of the nth-derivatives of f.

Dependencies
------------
<a href='http://jquery.com'>jQuery</a> , <a href='http://mathjs.org'>math.js</a>  , <a href='http://lodash.com'>Lodash</a> and <a href='http://visjs.org'>vis.js</a>

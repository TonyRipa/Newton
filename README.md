
Newton: An A.I. for Math
========================

Author : Anthony John Ripa

Date : 2020.12.10

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

Complementarily, `Newton` can also do an optional differential transform. The differential transform has 2 advantages. One is that it is cheaper (Time÷Accuracy) to calculate. Two is that it is all-in-one instead of preprocessing. This transform is again Laplace-like. It comes from the observation that the Taylor coefficients without factorial denominators (basically just the derivatives) can be put into (possibly repeating) sequence expansion .f(0)f'(0)f''(0)f'''(0) , and that this sequence is the Laplace transform , which `Newton` can put into fraction-form to look more Laplace-like , since the expansion is a relatively untraditional form . Another (although not necessarily the best) way of looking at this (for those who are already familiar with generating functions) is that the Laplace-Transform is the Generating Function of the nth-derivatives of f.

## Backtracking

Backtracking comes up often in computer science. In search, you may search a tree, down a specific branch without solution. Then you would backtrack, and proceed down a different branch. Different languages have different support for backtracking. Prolog has native support for backtracking. Many languages allow throwing an error, exception, or any throwable, which can be seen as a kind of backtracking. In C and C++, the address operator (or pointers in general) can be seen as a kind of backtracking. `Newton` may be thought of as exploiting the benefits of backtracking.

### Generating Process

In statistics, situations may arise where there is ambiguity that may be removed, by relying on the process that generated the data. Borel's paradox may be thought of as an example of this. Returning to the generating process may be thought of as a kind of backtracking. When the generating process is not explicitly available, it may be implicitly available via probabilistically inferring the generating process. `Newton` may be thought of as exploiting the benefits of probabilistic backtracking. `Newton` receives an input expression, processes it down to points, then tries to probabilistically backtrack to the expression (generating process). The inference implicitly uses Occam's Razor, so if available a simpler equivalent generating process (expression) results. This can also be thought of as a compressed version of the generating process, or denoised like an auto-encoder. `Newton` is also like active learning, because the generating process (expression) is always available to sample as many points as needed. Unlike limits, which recognize the generating process (expression) [best 0th order approximation] of an infinitesimally local region, `Newton` recognizes the global generating process (expression). The difference between guessing a missing pixel from its 4 neighbors, or the whole image. More like guessing all infinitely many points, from finitely many. Though models are typically blemish-free, `Newton` could restore blemishes to well-known models, where limits would fail.

### Numerical Stability

Backtracking arises in numerical stability. If an approach turns out to be numerically unstable, you may backtrack, and apply a more stable approach.

For example, you may want to check if a matrix is singular. You calculate the determinant. The determinant is almost zero. One possible conclusion is that now it is objectively inconclusive whether or not your matrix is singular. However, this is not the only conclusion. Another conclusion is that this particular test is inconclusive, but that another test may be conclusive. So backtrack, and try a different path. For example, I may instead take my original matrix and transform it into Row Echelon Form. This new form should have the same rank (same singularity or lack thereof) as the original. I can now perform a singularity test on this new matrix. In fact, since it is in some kind of standard form, I may have more possible kinds of singularity tests on this new matrix then I did on the original matrix. I could do a determinant, or I could merely check for a zero-row. As it turns out, by simply transforming to Row Echelon Form, I have already increased my numerical stability, so however I finish (determinant or zero-row check) will be more informative than without transforming. Let's say that I decide to proceed with a zero-row check. Now, I get something other than almost zero. Now I know whether my original matrix is singular.

Say that I want to simplify h/h at h=0. We write h/h|0. One way would be to distribute the evaluation operator over the division operator yielding h|0/h|0. Continuing we could separately simplify the numerator and denominator yielding 0/0. Standard algebra would conclude that now it is objectively inconclusive what value your original expression simplifies to. However, this is not the only conclusion. Another conclusion is that this particular test is inconclusive, but that another test may be conclusive. So backtrack, and try a different path. For example, I may instead take my original expression and simplify division first. I get 1|0. Continuing, I get 1.

Numerical stability and backtracking have seen widespread adoption in Linear Algebra, due in part to Linear Algebra being a lively field of active research. The idea that if something is inconclusive on one path, then it is objectively inconclusive on all paths, has been replaced in Linear Algebra with Numerical stability and backtracking. On the other hand, Elementary Algebra has changed little over the centuries, due in part to the belief that it was completed. This has led to its stagnation, and other fields like Calculus making up for its short-comings. We may allow Numerical stability and backtracking in Elementary Algebra, just as we do with Linear Algebra. Expressions like h/h|0 can be well-defined. This is more explicit fundamental and less contrived, than the hidden implicit Numerical Stability with Backtracking, found in Calculus law's like L'Hopital's Rule and limit laws in general.

## Complexity Control

To fit a dataset of size n, we can always create a model of size n (e.g. a lookup table). Models of this kind have low predictive power outside of the answers that they have memorized. This is called over-learning. A dataset can be well-learned by a model whose complexity is smaller than the data itself. If the model is too small this is called under-learning, where the model cannot even well-model the data it was given. We want to control the complexity of the model. Not too much. Not too little. Just right. This is like Occam's Razor.

In Advanced-Mode, `Newton` has a scalable complexity control in the user interface. The user can scale the complexity to the desired amount, to control over-fitting and under-fitting. In Basic-Mode, the complexity is controlled automatically. It starts with simple models, and tries to fit the data. If it validates, then `Newton` returns that as the answer. If it does not, then `Newton` increments the complexity. And the cycle repeats. If too many cycles progress, and nothing validates, `Newton` returns the best answer it has, and a message about the validation status.

## Dependencies

<a href='http://jquery.com'>jQuery</a> , <a href='http://mathjs.org'>math.js</a> , <a href='http://lodash.com'>Lodash</a> , <a href='http://visjs.org'>vis.js</a> and <a href='http://vuejs.org'>Vue.js</a>

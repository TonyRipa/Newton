
Newton: An A.I. for Math
========================

Author : Anthony John Ripa

Date : 2018.03.15

Live Demo at <a target='_blank' href='http://tonyripa.github.io/Newton/'>http://tonyripa.github.io/Newton/</a>

Newton
------

Consider the problem (x^2-1)/(x-1). One could attempt to factor the numerator (x+1)(x-1)/(x-1) then divide like terms and get x+1. Alternatively, one could attempt synthetic division and get the same result. These algorithms were created in an earlier time, which we could call the learning phase. However, what if we were in a phase before the learning phase where the algorithms did not yet exist. This would be akin to the situation Newton was in before he invented calculus. Well, we could do the two phase approach where we first have a learning phase to make an algorithm to solve the problem, then in the second phase solve the problem using the algorithm from the first phase. This would be more or less like what Newton did: Invent calculus then use calculus. There are other learning approaches, for example lazy learning. In lazy learning, we solve a specific problem instance on the fly (without a previous learning step). We could contrast this with the two phase approach (which for comparison we could call eager learning). In practice the lines are often blurred. Isaac Newton for example plausibly employed lazy learning specific problem instances on his way to inventing the full calculus. This is the spirit of the software `Newton`. `Newton` uses lazy learning to solve mathematical problems without relying on previously generated algorithms. To solve (x^2-1)/(x-1) `Newton` plugs in a few values and then uses regression to infer the solution is x+1.

Consider the problem ((2+h)^2-2^2)/h | 0. These are secants lines of the function x^2 where the secant intersects x^2 at x=2 and x=2+h . The |0 means evaluate at h=0. This would make the secant line a tangent line. Now a naive way to do this problem is to immediately apply |0 to the number and denominator: ((2+0)^2-2^2)/0 = (2^2-2^2)/0 = (4-4)/0 = 0/0 . Not helpful. We could try to simplify the function ((2+h)^2-2^2)/h = (4+4h+h^2-4)/h = (4h+h^2)/h = 4+h. We could then |0 and get a final answer of 4, which is the right answer. The step (4h+h^2)/h = 4+h has historically been considered problematic. The canonical answer is the piecewise function (h==0 ? undefined : 4+h). This is a line with a hole in it (at exactly the wrong place). If we then apply |0 we get undefined instead of 4. Hence the need for all the rigamarole of calculus. If however, we use Software `Newton`'s lazy learning approach we start with ((2+h)^2-2^2)/h plug in a few values and then use regression to infer the solution is 4+h. It does not conclude that the solution is (h==0 ? undefined : 4+h). Like most machine learning algorithms we get a solution that is smooth (low parameters & complexity), and hence more likely to be correct by Occam's razor. Then apply |0 and get the desired solution 4.

`Newton` solves algebraic problems without reliance on previously generated algorithms. `Newton` does not make the classical algorithm mistake of concluding ((2+h)^2-2^2)/h is (h==0 ? undefined : 4+h) and instead returns the smooth solution 4+h. `Newton`'s approach to algebra is clean enough to answer questions which would otherwise require a needlessly complex workaround like calculus.


Dependencies
------------
<a href='http://jquery.com'>jQuery</a> , <a href='http://mathjs.org'>mathjs</a> and <a href='http://visjs.org'>visjs</a>

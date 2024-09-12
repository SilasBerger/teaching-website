---
page_id: 5f07e03f-2b5d-4d01-a140-eb4ec4584290
---
import BrowserWindow from '@tdev-components/BrowserWindow';

# Math Formeln mit KaTeX

```md
Let $f\colon[a,b]\to\R$ be Riemann integrable. Let $F\colon[a,b]\to\R$ be
$F(x)=\int_{a}^{x} f(t)\,dt$. Then $F$ is continuous, and at all $x$ such that
$f$ is continuous at $x$, $F$ is differentiable at $x$ with $F'(x)=f(x)$.
```	
ergibt
<BrowserWindow>
Let $f\colon[a,b]\to\R$ be Riemann integrable. Let $F\colon[a,b]\to\R$ be
$F(x)=\int_{a}^{x} f(t)\,dt$. Then $F$ is continuous, and at all $x$ such that
$f$ is continuous at $x$, $F$ is differentiable at $x$ with $F'(x)=f(x)$.

</BrowserWindow>

oder blockweise

```md
$$
I = \int_0^{2\pi} \sin(x)\,dx
$$
```

ergibt
<BrowserWindow>
$$
I = \int_0^{2\pi} \sin(x)\,dx
$$
</BrowserWindow>

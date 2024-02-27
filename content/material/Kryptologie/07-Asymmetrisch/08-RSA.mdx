---
sidebar_custom_props:
  id: 7d1a1bb6-50e9-4c5d-8b4e-336b0124067d
  source:
    name: scf
---
# ⭐ RSA Algorithmus

Der **RSA** Algorithmus ist der aktuell am weitesten verbreitete asymmetrische Verschlüsselungsalgorithmus und wird etwa für die SSL/TLS Verschlüsselung beim HTTPS-Protokoll verwendet. Der Algorithmus wurde 1977 von Ronald **R**ivest, Adi **S**hamir und Leonard **A**dlerman unter dem Namen **RSA** entwickelt und publiziert[^1].

### Funktionsweise

Die Funktionsweise basiert darauf, dass es leicht ist, $c = m^{e}\: mod\: n$ zu berechnen, aber praktisch unmöglich, ohne den privaten Schlüssel `d` die Umkehr­funktion zu berechnen.

n
: öffentliche Zahl                     
e
: öffentlicher Schlüssel des Empfängers
d
: privater Schlüssel des Empfängers    
$m<n$
: Klartext                             
c
: Geheimtext                           


#### Verschlüsselung

Zur Verschlüsselung berechnet Bob den Geheimtext `c`:

$$
c=m^{e} \: mod \: n
$$

Wobei `mod` der Ganzzahlige Rest bei der Division mit `n` darstellt. Beispiel: $13 \: mod \: 4=1$, da $\frac{13}{4} = 3\: Rest\: 1$.

Die Zahl $n$ ist das Produkt von zwei ver­schiedenen Primzahlen $p$ und $q$, diese sind geheim. Wie können $p$ und $q$ geheim sein, wenn doch $n = p\cdot q$ öffentlich ist? Dies beruht nur darauf, dass die Primfaktor­zerlegung von $n$ zu rechen­aufwendig ist, da $n$ sehr gross ist (z.B. `1024` Bit lang).

Für die Zahl `e` muss gelten

$$
ggt(e, \phi(n)) = 1
$$

Hierbei ist

$$
\phi(n)  =  (p-1)(q-1)
$$
die Anzahl der zu n teiler­fremden Zahlen, die kleiner als n sind.

#### Entschlüsselung

Der Empfänger hat als privaten Schlüssel eine Zahl $d$ mit

$$
d\cdot e\: mod\: \phi(n) = 1
$$
daher
$$
d\cdot e  =  k\cdot \phi(n) + 1
$$
für irgend ein $k \in \N_{o}$.

Ist $n = pq$, so gilt nach einem Satz von Euler für alle Zahlen $m$ mit $m < n$ und für alle natürlichen Zahlen $k$:

$$
mk\cdot\phi(n)+1\: mod\: n  =  m
$$
 

Zur Ent­schlüsselung berechnet der Empfänger also

$$
\begin{aligned}
    
c^{d}\: mod\: n	&=  md\cdot e\: mod\: n \\
 	  &=  mk\cdot \phi(n) + 1\: mod\: n \\
 	  &=  m

\end{aligned}
$$

und erhält damit den Klartext $m$.

:::info ⭐️ RSA Schlüssellänge
Die RSA Schlüssel haben standardmässig `1024` oder `2048` bits, wobei Schlüssel mit `1024` bits mittelfristig als knackbar erachtet werden, so dass die Industrie heute oft mindestens `2048` bits voraussetzt.
:::

## RSA in Python

### Schlüsselerzeugung:

Als erstes wählt man zwei Primzahlen $p$ und $q$ und berechnet daraus

$n = p \cdot q$

und

$\varphi(n) = \varphi(p) \cdot \varphi(q) = (p-1) \cdot (q-1)$

```py slim live_py
p = 11
q = 13
n = p * q
phi = (p-1) * (q-1)
print(n, phi)
```

Nun muss man ein Zahlenpaar $e$ und $d$ finden, die bezüglich $\varphi(n)$ multiplikativ invers zueiunander sind. Das bedeutet, dass gilt:

$d \cdot e \mod \phi(n) = 1$

Das Zahlenpaar findet man mit dem sogenannten erweiterten euklidschen Algorithmus:


```py slim live_py
p = 11
q = 13
n = p * q
phi = (p-1) * (q-1)
### PRE
def euclidExtended(e, N):
    x1, x2, x3 = 1, 0, N
    y1, y2, y3 = 0, 1, e
    while True:
        if y3 == 0:
            print('Existiert nicht!')
            return None
        if y3 == 1:
            return y2 % N
        q = x3//y3
        t1, t2, t3 = x1-q*y1, x2-q*y2, x3-q*y3
        x1, x2, x3 = y1, y2, y3
        y1, y2, y3 = t1, t2, t3
```

Erster Versuch: 3 hat kein multiplikatives inverses bezüglich $\varphi(n)$

```py slim live_py
p = 11
q = 13
n = p * q
phi = (p-1) * (q-1)
def euclidExtended(e, N):
    x1, x2, x3 = 1, 0, N
    y1, y2, y3 = 0, 1, e
    while True:
        if y3 == 0:
            print('Existiert nicht!')
            return None
        if y3 == 1:
            return y2 % N
        q = x3//y3
        t1, t2, t3 = x1-q*y1, x2-q*y2, x3-q*y3
        x1, x2, x3 = y1, y2, y3
        y1, y2, y3 = t1, t2, t3
### PRE
e = 3
d = euclidExtended(e, phi)
```

Zweiter Versuch: 5 hat auch kein multiplikatives inverses bezüglich $\varphi(n)$

```py slim live_py
p = 11
q = 13
n = p * q
phi = (p-1) * (q-1)
def euclidExtended(e, N):
    x1, x2, x3 = 1, 0, N
    y1, y2, y3 = 0, 1, e
    while True:
        if y3 == 0:
            print('Existiert nicht!')
            return None
        if y3 == 1:
            return y2 % N
        q = x3//y3
        t1, t2, t3 = x1-q*y1, x2-q*y2, x3-q*y3
        x1, x2, x3 = y1, y2, y3
        y1, y2, y3 = t1, t2, t3
### PRE
e = 5
d = euclidExtended(e, phi)
```

Dritter Versuch: 7 hat ein multiplikatives inverses bezüglich $\varphi(n)$.

(Nebenbei: Der Grund, warum es mit 3 und 5 nicht geklappt hat: Die Zahlen müssen zu $\varphi(n)$ teilerfremd sein, aber 120 ist durch 3 und 5 teilbar)


```py slim live_py
p = 11
q = 13
n = p * q
phi = (p-1) * (q-1)
def euclidExtended(e, N):
    x1, x2, x3 = 1, 0, N
    y1, y2, y3 = 0, 1, e
    while True:
        if y3 == 0:
            print('Existiert nicht!')
            return None
        if y3 == 1:
            return y2 % N
        q = x3//y3
        t1, t2, t3 = x1-q*y1, x2-q*y2, x3-q*y3
        x1, x2, x3 = y1, y2, y3
        y1, y2, y3 = t1, t2, t3
### PRE
e = 7
d = euclidExtended(e, phi)
print(d)# => 103
```

Kurze Überprüfung: Ist das Produkt von $e$ und $d$ modulo $\varphi(n)$ tatsächlich 1?

```py live_py slim
phi = 120
d = 103
e = 7
### PRE
print(e * d) # => 721
print((e * d) % phi) # => 1
```

## Verschlüsselung

Der öffentliche Schlüssel besteht nun aus den Zahlen $e$ und $n$. Diesen darf jeder wissen.

Der private Schlüssel besteht aus den Zahlen $d$ und $n$. Dieser muss geheimgehalten werden.

Mit dem RSA-Verfahren lassen sich nun Zahlen von 0 bis (n-1) verschlüsseln.

Um eine Nachricht $m$ zu verschlüsseln, muss man folgendes berechnen:

$c = m^e \mod n$

Resultat ist eine verschlüsselte Nachricht $c$

```py live_py slim
e = 7
n = 143
### PRE
m = 141
c = m**e % n
print(c) # => 15
```

## Entschlüsseln

Um die verschlüsselte Nachricht $c$ zu entschlüsseln, muss man folgendes berechnen:

$m = c^e \mod n$

```py live_py slim
d = 103
n = 143
c = 15
### PRE
print(c**d % n) # => 141
```

## Praktische Anwendung: Text mit RSA verschlüsseln:

Um einen Text mit RSA zu verschlüsseln hat man nun zahlreiche Möglichkeiten. Hier ist nur ein Beispiel:

Zunächst wandeln wir jeden Buchstaben der Nachricht `'HALLO'` in eine Zahl um:

```py live_py slim
alphabet = 'abcdefghijklmnopqrstuvwxyz'
for buchstabe in 'hallo':
    print(alphabet.find(buchstabe), end=',')
```

Mit der Python-Funktion `bin` machen wir daraus Binärzahlen in form eines `strings`, allerdings brauchen wir die zwei ersten Zeichen `0b`, die Python vor jede Binärzahl schreibt nicht und zwacken diese ab. Ausserdem füllen wir die Zahl mit `zfill` immer mit Nullen auf 5 Stellen auf. Warum 5 Stellen? Weil man für 26 Buchstaben mindestens 5 Bit (= 32 Möglichkeiten) braucht:

```py live_py slim
print(bin(7)) # das 0b brauchen wir nicht
print(bin(7)[2:].zfill(5)) # abzwacken und mit 0 füllen

for number in [7, 0, 11, 11, 14]:
    print(bin(number)[2:].zfill(5), end=' ')
```

Aus diesen 5-Stelligen Binärzahlen machen wir 7-Stellige Binärzahlen, indem wir die Bits einfach der Reihe nach lesen. Falls es nicht aufgeht, hängen wir einfach noch Nullen dran. 

Warum 7 Bit? Weil für dieses Beispiel $n = p \cdot q = 11 \cdot 13 = 143$ ist, worin 127 (grösste Zahl mit 7 bit) gerade Platz hat. Das Resultat sind 4 Zahlen:

```py live_py slim
for number in ['0011100', '0000101', '1010110', '1110000']:
    print(int(number, 2), end=', ')
```

Diese vier Zahlen werden nun einzeln RSA-Verschlüsselt:

```py live_py slim
e = 7
n = 143
for number in [28, 5, 86, 112]:
    print(number**e % n, end=', ')
```

Am anderen Ende können die Zahlen wieder einzeln entschlüsselt werden:

```py live_py slim
d = 103
n = 143
for number in [63, 47, 70, 18]:
    print(number**d % n, end=', ')
```

Die Zahlen werden wieder binär umgewandelt, diesmal auf 7 Stellen mit Nullen gefüllt:

```py live_py slim
for number in [28, 5, 86, 112]:
    print(bin(number)[2:].zfill(7), end=' ')
```

Aufgeteilt in 5-Stellige Binärzahlen erhalten wir die ursprünglichen Zahlen und daraus die ursprünglichen Buchstaben:

```py live_py slim
for number in ['00111', '00000', '01011', '01011', '01110']:
    print(int(number, 2), end=',')
```

```py live_py slim
alphabet = 'abcdefghijklmnopqrstuvwxyz'
for number in [7, 0, 11, 11, 14]:
    print(alphabet[number], end=' ')
```

## Sicherheit

Warum ist dies sicher? Dieses Beispiel wäre natürlich nicht sicher, weil die Primzahlen viel zu klein sind, aber bei grossen Primzahlen $p$ und $q$ würde es viel zu lange dauern, diese Teiler nur aus $n$ zu bestimmen.

Um dies zu verdeutlichen hier eine naive Funktion `factors`, die die Teiler einer Zahl zurückgibt, falls sie exisiteren. In der Zelle darunter wird diese Funktion benutzt, um Primzahlen zu finden indem einfach eine Zahl nach der anderen durchprobiert wird. Wird eine Primzahl gefunden, verdoppeln wir unseren Kandidaten und suchen von dort aus weiter.

Am Anfang geht das ganze recht schnell, aber schon bald dauert es ewig lange, um die nächste Primzahl zu finden. Einerseits, weil es immer weniger Primzahlen gibt, aber andererseits wird die `factors`-Funktion immer langsamer.

```py live_py slim
from browser import timer
i = 1

def factors(n):
    for i in range(2, n):
        if n % i == 0:
            return i, n // i

def check_next():
    global i
    if factors(i) is None:
        print(i, end=', ')
        i = i * 2
    i = i + 1

LIMIT = 200

for q in range(LIMIT):
    print(q)
    timer.set_timeout(check_next, 0.1)
```

[^1]: Quelle: [techtarget.com](https://www.techtarget.com/searchsecurity/definition/asymmetric-cryptography)

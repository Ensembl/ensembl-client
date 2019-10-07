# Rust

_IMPORTANT: This document is far from ready. Bits are missing, incorrect. Most is badly worded. Do not use it yet. In fact, it probably won't end up as a single document. It is in github only to put it under version control._

Here's a proposed way to get up-to-speed with writing Rust code in the genome browser.

1. Learn Rust to a basic level. (~2 weeks)
2. Write some small useful, stanalone thing in Rust. (a few days)
3. Learn how to compile the current browser build system and set up your machine. (a few days)
4. Learn the (currently abysmal) code-structure of the app (~2 days)
4. Do some tidying, unit-tests, or minor fixes in the codebase. (~2 weeks)
5. Profit!

## Learn Rust to a Basic Level

Rust is not an easy language to learn. It will take longer than, for exmaple, going from Python to Perl. But it has a large community and you don't need to understand all the space-cadet advanced features to get going. A lot of the browser codebase was written when I didn't understand much of the language and it's perfectly possible to get going without understanding them. I'd recommend learning Rust _outside_ of the context of the browser and webassembly, for example on the command line. The Rust Book is invaluable, but isn't an easy read.

### Good resources

* The Rust Book
* Rust introduction
* Closures

### Hints

This section contains some hints about rust. It doesn't contain much info about the boring bits that are similar to other languages. I suggest you skim over this bit first, then read the Rust Book and then come back to this and read it again.

* Ownership is important and a pain to understand at first. It is the defining feature of the language and there are plenty of posts and tutorials out there helping you with it. I will add my twopeneth later in this document.

* Avoid closures early in your learning (Fn, FnMut, FnOnce, etc). They are very useful and we use them extensively but are an add-on feature implemented in terms of more fundamental language features and best understood in those terms.

* Avoid "explicit" lifetimes as much as possible. They are very useful and you need to understand lifetimes as a theoretical idea, but don't mess with them unless really necessary. I've tried to resist the temptation of using them even where they would be useful as they are a barrier to learning. In a couple of places they sneak in in simple patterns.

* You need to become familiar with Option, Result, Vec, and HashMap from the standard library.

* You need to understand Box, Rc, and RefCell, and that they are necessary in some places, though not the main way of handling data in Rust. The browser uses them a _lot_; more in the older code where I didn't understand how to avoid them, but they are not _bad_.

* You need to unterstand the difference between a String and &str.

#### Ownership

Here's some hints to help with understanding ownership.

##### How Memory Works

Don't worry, there's no need to think about the following day-to-day when using Rust, but is does help while learning to bear it in mind when working out _why_ something is needed. There's nothing in the following that is Rust specific. It applies across (almost) all programming languages.

Computers only have access to memory arranged in a single dimension, by address, in a vast featureless line of memory cells.

There are two main kinds of way data that can contain more than a single value:

   1. A value can have different parts which occupy adjacent memory addresses, each containing some predefined, named value of some inner type. To access some part, some offset is applied to the start of the value and that part interpreted according to its own shape. These are "structure-like" values.

   2. A value can be an arbitrarily-long sequence of some value of an inner type. To access some index of the data an offset is applied which is a multiple of the size of the contents. They are "array-like".

There are also enums, which work like structs with minor wrinkles. Often these kinds of structured data are combined into more complex data: arrays of structures; structures of arrays; structures of structures of arrays of structures; ....

The important thing is that:
  1. structures occupy a fixed amount of space where each "part" at a different offset serves a different purpose and mat be a different "shape";
  2. arrays repeat the same type of value (of the same size) over and over again, and a value at an aribtrary offset can be accessed by offsetting the location to a multiple of that size.

In each case, such a value may be created on-demand, and some place needs to be found for it in the overall memory space. The space allocatable to a particular value will be finite: there will be some other structure following it that it must not crash into. That's fine for structures, as they don't grow, but what about an array-like object? What if you want to add to it? To handle this, practically all languages which implement arrays have a "managing" structure which is the thing that the rest of the program considers "the array". The _actual_ data is stored in some other data-structure which is large enough for-now (the size being stored in the structure) and referred to in the managing structure. If the array grows "too big" inside, then more memory is requested by the managing structure, the old data moved into it and the pointer moved and the old space freed. Becasue all this happens behind the managing structure, nobody notices.

The main reason for understanding this is to understand `Box<>` and why it's needed. If you have a structure of type X, which contains a subvalue of type  Y that value is stored _actually inside_ the structure. That's no good sometimes. Particularly in two circumstances:

  1. in something like a tree, you might want to add a "left" and "right" node to a definition of a node. Of course, you can't define a node to contain another node, or you would need infinite space! What you really mean is that it contains some kind of pointer to another node which is elsewhere in memory.

  2. if you have some kind of abstract interface with various, hidden, internal gubbins that may be one of a few varieties obviously you can't store those in a fixed amount of space, either.

`Box` to the rescue. Box in this case just really means what in other languages are called "references" or "pointers". The way they interact with rust references (which we've not introduced yet) is reasonably subtle but don't worry about that yet, just make sure you call them Box's and not anything else to avoid confusion.

In case 2 above you will see the word `dyn` written in the Rust code. This is just a reminder for the programmer that there's some extra complexity there. This is because if you call an abstract thing some indirection needs to take place to that particular implementation's code, which isn't always the fastest thing. When you write, for example, `Box<dyn MyTrait>` you're just being reminded of that.

##### How Memory Management Works

You don't get infinite amounts of memory, you need to give some back when you are done. That can be problematic because when are you done? The problem is that references to memory are so easy to copy. Who knows when the last reference has gone away? Traditionally there are two answers:

  1. the runtime knows (garbage colleciton);
  2. the programmer knows (explicit freeing).

The problem with these approaches are that the programmer typically gets it wrong and frees stuff too early or too late but the runtime often keeps things hanging around for way too long, needs lots of resources, and decides to tidy up at inconvenient times.

Rust adds a third option

  3. the compiler knows.

This is a relatively new approach, though not new to Rust (Apple headed in this dierction with Objective C, for exmaple).

That means that when you give your program to the compiler, Rust knows at some point "aha, when we get to this point, these variables are no longer used, I will free them". It's easy to see how this would be done for some function-local counter but that this is possible at all in the general mayhem of modern software, -- to say "here I know this is no longer used" is quite magical. Rust needs a few hints and sometimes this can get irritating ("arguing with the borrow checker"). But generally those hints expose poorly thought-out bits of the architecture so it's actually doing you some good!

##### Ownership

Here's the key idea: every value is _owned_ by some piece of code. This is epxressed as a "lifetime" in Rust, but that jargon is used in overlapping, confusing ways by the Rust devs, and not at all like you imagine the word might mean, so I'm going to avoid it in this initial description.

Ownership may be passed to some other piece of code, at which point the original code no longer owns it. When the owning code ends without handing off ownership to some other piece of code a value dies. For example, a local variable is owned by the function (or whatever) where it is defined. But say you put it into a Box (see above). That Box now owns your value. You can interact with it through the box but not directly any more, as soon as you put it into the box it's not yours. But you do own the box. If you are done and haven't, in turn, handed the box to some other code then _the box_ dies. As part of the box dying, the value inside it dies, too. So, say you have a tree with a node definition containing a box for its left and right nodes. Somehow you've built a big tree datastructure and have the value at the root. Then you let go of it. The first node is freed, which frees the box of the left and right, which frees, ....

##### References

Without some kind of get-out-clause, ownership would be irritating-to-impossible to use. Those get-out-clauses are references. There are two kinds of reference, mutable and immutable (more of which later) and they let you sneakily mess around with data you don't actually own! The main condition that stops this being a problem is that the reference itself cannot out-live the object. So the thing that frees stuff up when the owner drops it doesn't need to worry about references. Some other bit of the rust compiler has checked there are no references any more.

For example, say you have a structure you own and you want to pass it to a function to look at it or to mess with it. If you actually passed the ownership over to the funciton that would work but, inconveniently, the function would need to pass it back to you in its return value when it is done. You'd have a kind of pass-the-parcel game. Instead, you can pass a reference. The function can look at it or mess with it, never owning it. Because your function won't carry on (and so won't end and maybe drop the object) until the sub-function is done, the compiler knows that the value will be alive all that time. The compiler makes sure that the function doesn't do anything naughty with the reference (such as sneekily put it into some long-lived data-structure) by insisting that the reference argument lasts only as long as the function itself.

So, the two types of reference, immutable (`&`) and mutable (`&mut`). They function in the same way, except that things with immutable references cannot change the things they point to. This is very useful in being analysing code: if it was only an immutable reference, it hasn't changed. There's also a rule. You can only have one mutable reference at once _or_ as many immutable references as you like. This many-readers/one-writer type arrangement will be familiar to people who know about file-locking and serves a similar purpose, to avoid clashing writes which stomp all over each other. While only a big issue in multi-threaded applications, it's also useful discipline to keep your APIs clean as the alternative is rarely the right behaviour. It can be irritating to meet this requirement comtimes, though.

In a function signrature `&` passes an immutable reference, `&mut` a mutable one, and no prefix at all transfers ownership! That means that no-prefix-at-all is usually _not_ what you want.

There's a trick with references and return values. You can actually return a reference to some field in a structure, even a mutable one. So how does the compiler make sure you don't do anything naughty with that reference so that it outlives the structure itself? It ties the lifetime of the returned reference to be _no longer than_ the reference to self which you passed to the getter in the first place. There are actually more complex ways that all the arguments to a function have their lifetimes tied together that helps make stuff tractable. You'll occasionally see an explicit lifetime (denoted `'a`, or something like that) sneak into a function signtaure to help the compiler out, despite the general prohibition on using them in anger in the browser.

##### Rc

Sometimes even references are not enough. In this case `Rc` can come to the rescue (reference count). Like `Box`, Rc takes ownership of a single object away from you and keeps it for itself. Like box you can interact with the object as if it were unwrapped. Unlike box, you can clone an rc. When you clone an rc you create another rc which is completely independent of the first except that they both reference the same underlying object! The implementation of rc is keeping a count of the number of rc objects pointing to the inner object. When that count reaches zero, menaing that no Rcs remain, the inner object is also left to die.

This isn't a wonderfully rusty way of handling lifetimes but it works, is safe, and is sometimes necessary (ie there is no purist rust way). Don't waste your time trying to avoid Rcs if one seems useful.

This means you can, in effect, "share" ownership of an inner object. An Rc by itself only yields immutable references to an object. Just make sure not to create circular references (this is acually quite hard to do because of the immutableness) as with circular references the objects will never die (they each point to each other so each have a count of at least one).

You will only really see a bare Rc (eg `Rc<MyObject>`) in cases where it's basically some unchanging thing (such as a parsed config) which various pieces of code need references to some bit of.

What you see much more often is an `Rc` with a `RefCell` inside. (By the way, An `Arc` is a typesafe `Rc`).

##### RefCell

A RefCell is a way to be slightly naughty with an immutable reference. Like an rc and a box, you can store whatever you like inside it and it will take ownership from you, leaving you with ownership of the RefCell instead. Unlike an rc or box you can't just mess around with the inner object "as if it wasn't there", you need to call a method to get a reference to it. You can call `borrow()` to give you an immutable reference or `borrow_mut()` to get a mutable one. That's a bit of an over-simplification, you don't actually get a reference in either case you get a funky, internal thing (called a Ref or RefMut) but one that can be treated as if a reference nevertheless.

Here's the selling-point: you only need an _immutable_ reference to the RefCell to get a _mutable_ reference to the inner object! Thing about what that would let you do. You could store something inside a struct, say, and then in a method which only takes an immutable reference to that struct modify the contents of the RefCell: secret mutability!

While it sounds powerful, it also sounds bad: what's the _point_ of distinguishing them, then, if there's this get-out clause? Well, RefCell checks up on you. It won't let you have more than one `borrow_mut()` result at once or many `borrow()`s. This is checked _at runtime_. These are exactly the same rules as the main Rust way of doing it, but it does it at compile time. This means that you get the same guarantees except your code will reliably blow up at runtime, not compile time. Not ideal, but reliable and necessary in some cases.

A good way of implementing RefCells reliably is to only borrow and set/get values inside certain small accessors which get out a reference, do a bare minimum and then return the result. As these accessors don't do anything fancy, they can't be nested inside each other so you can't have multiple, simultaneous borrows. `Mutex` is a thread-aware alternative to Refcell with a slightly different API.

You'll often see `Rc<RefCell<MyType>>` scattered around code. This creates a thing very much like every bog-standard reference object in many other languages: the Rc does the memory management and the RefCell allows updates despite being in an Rc.

Sometimes RefCells are inevitbale. Don't waste too much time trying to avoid them until you get to the polishing stage and, even then, some will be necessary.

##### Clone (and Copy)

You will see lots of calls to `.clone()` everywhere (too many). clone is defined to return 'another' value of the same type. That could mean any value but in practice it creates a 'copy' of the value you've given. For object-like-things you get a true copy of your data (if the trait has just been derived as it is in 99% of the cases, and all non-suprising ones). But for Rc you get a new rc referring to _the same underlying object_ (ie the underlying object remains shared). For `Vec`s the situation is a bit more complicated and depends on if the insides implement clone: you may get a vec of references or a true, deep copy. Calling `.to_vec()` is a better way to get a deep copy. Check oyur clones carefully for unnecessary copying on patchs dealing with big data! In general lots of clones is a sign of vagueness (there's a lot in the browser code).

Copy means a Clone which is equivalent to a proper byte-wise memory copy. It should only be implemented for types like numbers, booleans, etc.

#### Option and Result (and how to do exceptions)

Option and Result are relatively simple types compared to the deep stuff we've done so far but are ubiquitous and so it helps to understand them well.

`Option<X>` is an enum which can contain an X (written `Some(x_value)`) or nothing at all `None`. It basically introduces the ideas of values which "can be null". `unwrap()` is the method to get the contents of the `Some`. It will panic if the value is `None`. Unless you're careful, this makes it Rust's null-pointer exception! There are other, safer methods for trying unwraps, testing if null, etc, of course.

`Result<Y,N>` is an enum which can return some value on success (of type `Y`, written `Ok(y_value)`) or some error (of type `N`, written `Err(n_value)`). Result is particularly important because the language has some builtin syntax to help you write something resembling exceptions, `?`. If you add `?` after an expression that returns a Result, that result is unwrapped. If it's an Ok, then that unwrapped Ok is passed onto the rest of the expression. If it's an error, though, something special happens. The compiler sorts out all the necessary contidionals so that the _calling_ method also exits with the error: the error is passed up the chain. This means that you can easily write deep function call stacks that propagate errors without having to add complex if/else's everywhere. Adding a new operator just for that may sound rash, but its main selling-point is that it's compact (for exmaple `x = get_thing()?.x.run_thing()?`) so it's important that it's not much effort to express.

#### Objecty-stuff

Rust's main structuring concept is a riff on the "objects" of object-oriented languages. I wouldn't go so far as to say Rust is object-oriented, but the main structuring idea is the object. In that sense it's quite like python. It's certainly not a functional language or a logic language, so thinking ot things in terms of objects is a good start.

The basic idea is that structures can have functions associated with them (implementations, introduced with `impl`). You can then use the usual OO syntax of (`whaterver.run(a,b,c)`) and the relevant method will be called. Enums can also have the same thing applied. Because strucutres in Rust are not at all abstract, because they are completely concrete and of a particular size with a certain exact contents and memory layout (for anything else you need traits) there's no need for "dynamic dispatch", ie at compile time the compiler always knows exactly which method to call without any time-consuming indirection.

To get around the restriction on the complete non-abstractness of structs, there are traits. Without traits these implementations wouldn't really be Objects in any real kind of sense at all. We need to be able to define abstarct superclasses, interfaces or whatever, to implement generic methods. Lion, Tiger and Panther may all be concrete struct,s but if we want a generic method called roar we need something like BigCat which they implement. BigCat would be the trait here.

Because Rust needs to know exactly how much memory to free or, in an array, how far to jump over each member, you can't just forget about the concrete implementation of a type and carry on knowing only the trait. You can pass a reference to a `Lion` to something that expects `&BigCat` of course, but you do need to add a `dyn` (`&dyn BigCat`) to acknowledge that dynamic dispatch is now needed (that means that the compiler needs to include supporting bumph for this function so that if the method in-turn calls any of the trait's methods it knows which type's methods to call). It will do this behind the scenes but requires `dyn` to confirm you know what you are doing.

The main point of traits is that they can contain methods. Each concrete struct which implements some trait does so by specifying how the methods for that trait should work _in that particular case_. When all you've got is a reference to a trait, all you can do is call a method of it.

Back to `Box`'s, rmember them? Remember that we can write `Box<dyn Trait>`? Imagine you wanted an array of `BigCat`s. That's no good: If Lions are different sizes to Tigers, you'll never know how far to jump: an array needs to contain things of the same size. That's why you need something like a Box, which _is_ of a fixed size, in this case a fixed size reference to some trait. You can see why the `dyn` is necessary now, too, as it needs to include gubbins to direct any user to the right methods for that particular kind of big cat.

You will very often see traits in boxes? Why? Well this is a good way to keep hold of traits when you really don't care about the underlying object any more. You put them in a box and maybe store them in your struct. You can do that because boxes take up fixed space (unlike traits).

#### Closures

This section looks intimidating because there's quite a lot in it. It's best to understand this stuff properly but most of the time there will be little need to engage with it. Most of the time you use closures they will "just work". If you get into a pickle the compiler will help you out but will assume you understand the concepts below. Closures are also much rarer in Rust than, say, in Javascript because many things that in Javascript would be closures are trait implementations in Rust (particularly in the browser). Closures are mainly used for run-once throw-away things. Tak a deep breath, dive in, and forget about it until you need it.

##### Overview of Closures

Every good programming language has closures beacuse they are so expressive. It is easy to get scared by closures in Rust, but most of the time they "just work".

The reason that closures can seem complicated in Rust is that the stranger kinds of things that a programmer can put into a closure can interfere with rust's ideas about ownership.

Let's be concrete about what a closure is.

The very simplest closures are functions. They take their arguments, do something to them and return some other value. Such closures are very easy to use in Rust and they won't worry you much.

Much of the power of closures, though, comes from their ability to "capture" variables. Some variable defined in the outer function, defining the closure, is used by the closure and that value survives from one call to the next. For exmaple, it could be a counter and each time the closure is called that counter increased. Or it could be something as simple as a read-only reference. You can imagine these values of having been transfered "into" the closure variable. When the closure is called, the closure code then has access to that value.

So there are two interesting events in the life of such a captured variable: when it is first captured at closure creation time and when it is used when the closure is called. I'm going to say that there's a "limbo" into which that variable sits, a little walled-garden inside the closure object, between the point of definition and the point of use. (This isn't common terminology, but I think it's a good analogy).

##### Closures which escape scope

So how do these two events make ownership complex? Let's think about the first one: transfering a variable out of the containing function into limbo. That's just fine except for references. We don't want limbo lasting longer than the scope of those references as the references in limbo could become invalid. So Rust ensures that the limbo has no longer lifetime than the place where the closure is defined.

Sometimes that's no good! Of course, it's ok for a thing you pass to map and filter. When the map or filter is done you throw the closure away. But say you want some function to return a closure or to store it in a long-term data-structure? For this rust has the "move" keyword. move, when applied to a closure transfers ownership of everything into limbo from the containing function. It also makes sure there's no references placed into limbo which might die before the closure itself does (at which time the limbo will go, too).

That's the only complexity with the first move, that of capturing variables. If it's anything more than a one-shot, throw-away closure, "move" captured variables inside.

##### Types of closure

The second step, using the variables in limbo, is more complex.

Say you only call a closure once. In that case, you're fine: just transfer ownership to the closure code. The contents of the closure can do what they want with those variables, even transfer ownership away. Everything that's not transfered somewhere else will get dropped at the end of the callback and the closure become useless at the end. That's fine, you're only calling it once.

But, say you want to call a closure _more than once_? Well, You can only give the closure code some kind of reference to the variables in limbo, then. After all, they will be needed for the next time the closure is called. No transferring away of ownership! The variables carry on living in limbo until the closure itself is destroyed.

Say that you update some of those captured variables (such as in our counter example). What you're doing then is updating the closure, so you need a mutable reference to the closure. After all, you don't want two different threads trying to do this at once and that's what this &mut thing is all about. In this case, you can let code call your closure as many times as you like, as long as you have a reference to it.

But if you only ever read the captured variable, then all the caller needs is an immutable reference and so they can call it in pretty much all circumstances.

In each of these three cases there's a trade-off between the things you are doing inside your closure code (handing away ownership, changing, or only reading) and how it can be used (only called once, only with a mutable reference or full ownership, or with any reference). The uses to which a closure is put are described with `FnOnce`, `FnMut`, `Fn` in, for exmaple, type signatures of methods which accept closures. On the part of the caller they variously restrict the "kind" of closure the method will accept. Within the method implementation they restrict what you can do with such a closure.

* An `FnOnce` requires the thing using a closure only to call it once. All closures are FnOnce, so this gives maximum flexibility to the caller to dream up an arbitrarily whacky closure. The consumer, though, is bound only to call it once. If it can manage that, this is great and FnOnce is the "best" kind of closure for people consuming your API, if you, as consumer, are ok with the restriction. Take every opportunity to make your methods accept an `FnOnce`.

* An `FnMut` requires that the thing using a closure have a mutable reference or ownership of a closure when calling it. That's probably not much of a burden. It also requires that the caller not transfer ownership of any captured variables, which very few closures do. As a result this tends to be the goldilocks kind of closure that you will see everywhere.

* An `Fn` requires very little of the thing using a closure, just that it have some kind of reference to it (of course!). That's great from the perspective of the thing using the closure. However it requires the closure only have read access to any of its captured variables. As a result being required to create an Fn closure can be restrictive and it's slightly annoying to find this in an API.

##### Consequences

* If you are writing something which consumes a closure, prefer `FnOnce`, then `FnMut` then `Fn`. The compiler will soon tell you off if you can't.
* If you are thinking of writing a closure:
  * if it moves ownership of a captured variable, make sure the thing accepting the closure is `FnOnce`.
  * if it modifies a captured variable, make sure the thing accepting the closure is `FnOnce` or `FnMut`.
  * if it only reads a captured variable or has no captured variables, you're in clover, don't worry about it.
* If your closure moves out of the scope which creates it (returned or stored somewhere), you'll probably need a move. The compiler will warn you.

## Write some small useful, stanalone thing in Rust.

It's up to you what you write, but I recommend something which:

* uses `struct`s, impl, etc to implement some functionality;
* uses `&mut` and `&`;
* uses at least one closure;
* uses `Option`, `Box`, and maybe `Result`.

If you're ok with a completely 'toy' exmaple: why not this:

> Two structs one a `Lion`, one a `Tiger` both of which implement the trait `BigCat` which has a method `eat(&self, victim_name: &str)` which prints something amusing to the screen in each case. Then create an array of `BigCats` containing two lions and three tigers. (And various extensions to this to include Option (say, a method to search through an array of BigCats to find the first Tiger, or None if there are none)).

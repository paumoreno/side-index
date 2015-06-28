jQuery Side Index
=================

A jQuery plugin that builds a side index similar to the one you can find in your smartphone contact list.

How to use it
-------------

The minimum requirement to build a side index is to have a list of items (no specific markup is required) and a series of anchor targets in it. For example, given an alphabetic list of names, each  initial letter could be an anchor target.

These anchor targets must have an `id` attribute. In order to create the side index, just add the boolean attribute `data-side-index` to each of the anchor targets.

```
    <ul id="names">
        <li id="A" data-side-index>
            A
        <li>
        <li>
            Alice
        </li>
        ...
        <li id="B" data-side-index>
            B
        <li>
        <li>
            Bob
        </li>
        ...
    </ul>
```

Then, create the side index like this:

```
$('#names').sideIndex();
```

**Note:** There should be only one indexed list per page.

Additional markup
-----------------

The contents of the side index can be modified by adding some more information in the list anchor targets.

By default, the section labels in the side index are taken from the value of the `id` attributes of each anchor target. You can use different labels by setting the value of the `data-side-index` attributes:

`<li id="h12" data-side-index="12">`

When swiping through the side index, an indicator appears showing the section currently shown. By default, the label of this indicator is the `id` attribute of the anchor target, or the value of its `data-side-index` attribute. If you need to give it a differnt label, just add the `data-side-index-indicator` attribute with the value you wish.

`<li id="h12" data-side-index="12" side-index-indicator="12:00">`

Options
-------

These are the optional parameters you can pass to jQuery Side Index:

- `indexTop`: Top margin of the side index, expressed in pixels (default is 0). Useful to avoid overlapping the side index with a fixed top bar.

- `targetTopOffset`: Top margin that will be left when scrolling to the anchor targets, expressed in pixels (default is 0). Useful to avoid a fixed top bar to hide the anchor title.

```
$('#names').sideIndex({
    indexTop: 50,
    targetTopOffset: 60
});
```

Author
------

Pau Moreno Martín

[@paumoreno](https://twitter.com/paumoreno)

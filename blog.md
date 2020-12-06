---
layout: default
title: Blog
---
# यथामति पद्यबद्ध मराठीतला स्वैर भावानुवाद..

<ul>
    {% for post in site.data.posts %}
    <li>
        <h2>{{ post.title }}</h2>
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
        <p>{{ post.source }}</p>
        <p>{{ post.category }}</p>
        <p>{{ post.content }}</p>
    </li>
    {% endfor %}
</ul>
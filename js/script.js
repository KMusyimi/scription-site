// Smooth Scroll
(function ()
{
    const logo = document.querySelector(".logo");
    logo.addEventListener("click", backToTop);
    function backToTop()
    {
        document.body.scrollTop = 0;
        // safari
        document.documentElement.scrollTop = 0;
    }
    const navLinks = document.querySelectorAll("header > nav > ul > li > a");

    navLinks.forEach(link =>
    {
        link.addEventListener("click", smoothScroll);
    });
    function smoothScroll(evt)
    {
        evt.preventDefault();
        const targetID = evt.target.getAttribute("href");
        const targetSection = document.querySelector(targetID);
        const sectionTop = Math.floor(targetSection.getBoundingClientRect().top - 130);
        window.scrollBy({ top: sectionTop, left: 0, behavior: "smooth" });
    }

    window.addEventListener("load", function ()
    {
        const posts = document.querySelectorAll("#page > section");

        let postTops = [];

        let pageTop;

        let counter = 1;

        let prevCounter = 1;

        let doneResizing;


        resetPagePosition();
        window.addEventListener("scroll", function ()
        {
            pageTop = window.scrollY + 250;

            if (pageTop > postTops[counter])
            {
                counter++;
            } else if (pageTop > 1 && pageTop < postTops[counter - 1])
            {
                counter--;
            }

            if (counter != prevCounter)
            {
                navLinks.forEach(link =>
                {
                    link.removeAttribute("class");
                });
            }
            if (pageTop < postTops[0])
            {
                return;
            }
            const thisLink = document.querySelector(`header > nav > ul > li:nth-child(${counter}) > a`);
            thisLink.setAttribute("class", "selected");
            prevCounter = counter;
        });
        window.addEventListener("resize", function ()
        {
            clearTimeout(doneResizing);
            doneResizing = setTimeout(() =>
            {
                resetPagePosition();
            }, 500);
        });

        function resetPagePosition()
        {

            postTops = [];
            posts.forEach(post =>
            {
                postTops.push(Math.floor(post.getBoundingClientRect().top + window.scrollY));
            });
            const pagePosition = window.scrollY + 250;

            counter = 0;

            postTops.forEach(post =>
            {
                if (pagePosition > post)
                {
                    counter++;
                }
            });
            if (pagePosition < postTops[0])
            {
                return;
            }
            navLinks.forEach(link =>
            {
                link.removeAttribute("class");
            });
            const thisLink = document.querySelector(`header > nav > ul > li:nth-child(${counter}) > a`);

            thisLink.setAttribute("class", "selected");

        }
    });

})();

// Flexslider

(function ()
{
    window.addEventListener("load", function ()
    {
        const slideCount = document.querySelectorAll(".flexslider .slides > li").length;
        const ctaCount = document.querySelectorAll(`.cta`).length;

        let slideWidth = document.querySelector(".flexslider").offsetWidth;
        const flexslider = document.querySelector(".flexslider");
        let totalWidth = `${slideWidth * slideCount}px`;

        let slider = document.querySelector(".flexslider ul");

        let counter = 0;
        let currentCta = 1;
        let leftPosition = 0;

        let slideInterval = 8500;

        let doneResizing;

        slider.style.width = totalWidth;
        // when the slide changes call to action pops from the bottom slide need to wait until the cta is displayed before we move to the next slide
        // get the cta and the corresponding slide
        ctaAnimate();

        const slides = () =>
        {
            counter++;


            if (counter === slideCount)
            {
                const cloneSlider = slider.cloneNode(true);
                flexslider.appendChild(cloneSlider);
                flexslider.lastElementChild.style.left = `${slideWidth}px`;
                leftPosition = `-${totalWidth}`;
                setTimeout(() =>
                {
                    flexslider.lastElementChild.style.left = 0;
                    flexslider.firstElementChild.style.left = leftPosition;
                }, 70);
                setTimeout(() =>
                {
                    flexslider.removeChild(flexslider.firstElementChild);
                    const cta = document.querySelector(".slide1 .cta");
                    cta.style.bottom = 0;

                }, 1200);

                const ctas = document.querySelectorAll(".cta");
                ctas.forEach(cta =>
                {
                    cta.style.bottom = `-${500}px`;
                })

                counter = 0;
            } else
            {
                leftPosition = `-${counter * slideWidth}px`;
                flexslider.firstElementChild.style.left = leftPosition;
            }
            ctaAnimate();


        }

        let slidesTimer = setInterval(slides, slideInterval);
        flexslider.addEventListener("mouseover", () =>
        {
            clearInterval(slidesTimer);
        });
        flexslider.addEventListener("mouseout", function ()
        {
            slidesTimer = setInterval(slides, slideInterval);
        });

        window.addEventListener("resize", function ()
        {
            clearTimeout(doneResizing);
            doneResizing = setTimeout(() =>
            {
                resetSlides();
            }, 1000);
        });

        function resetSlides()
        {
            clearInterval(slidesTimer);
            slideWidth = document.querySelector(".flexslider").offsetWidth;
            slider = document.querySelector(".flexslider ul");
            totalWidth = `${slideWidth * slideCount}px`;
            flexslider.firstElementChild.style.width = totalWidth;
            flexslider.firstElementChild.style.left = `-${counter * slideWidth}px`;
            slidesTimer = setInterval(slides, slideInterval);
        }

        function ctaAnimate()
        {
            if (currentCta > ctaCount)
            {
                currentCta = 1;
            }
            else
            {
                const cta = document.querySelector(`.slide${currentCta} .cta`);
                cta.style.bottom = 0;
            }
            currentCta++;
        }
    })
})();


// Tabs
(function ()
{
    const tabs = document.querySelectorAll("#tabs ul li a");
    tabs.forEach(tab =>
    {
        tab.addEventListener("click", handleTabsEvt);
    });
    function handleTabsEvt(evt)
    {
        evt.preventDefault();
        tabs.forEach(tab =>
        {
            tab.removeAttribute("class");
        });
        evt.target.className = "selected";

        const tabHref = evt.target.getAttribute("href");

        const newTab = document.querySelector(tabHref);
        const oldTab = document.querySelector(".tab--active");
        oldTab.classList.add("tab--visually-hidden");
        oldTab.addEventListener("transitionend", function ()
        {
            oldTab.className = "tab--hidden";
            newTab.classList.remove("tab--hidden");
            newTab.classList.add("tab--active", "tab--visually--hidden");
            setTimeout(() =>
            {
                newTab.classList.remove("tab--visually-hidden");
            }, 100);
        }, { once: true });
    }
})();


// Content Rotator
(function ()
{
    const quoteCount = document.querySelectorAll("#rotator > blockquote").length;

    function contentRotator()
    {
        let counter = 1;
        setInterval(() =>
        {
            const currentQuote = document.querySelector(`#rotator > blockquote:nth-child(${counter})`);
            currentQuote.classList.add("quote--visually-hidden");

            currentQuote.className = "quote--hidden";

            if (counter < quoteCount)
            {
                counter++;
                const nextQuote = document.querySelector(`#rotator > blockquote:nth-child(${counter})`);
                nextQuote.className = "quote quote--visually-hidden";
                setTimeout(() =>
                {
                    nextQuote.classList.remove("quote--visually-hidden");
                }, 300);
            } else if (counter === quoteCount)
            {
                counter = 1;
                const firstQuote = document.querySelector(`#rotator > blockquote:nth-child(${counter})`);
                firstQuote.className = "quote quote--visually-hidden";
                setTimeout(() =>
                {
                    firstQuote.classList.remove("quote--visually-hidden");
                }, 300);
            }

        }, 8000);
    }
    contentRotator();
})();

// Features Rotator 
(function ()
{
    // current feature after set interval it move to top by set pixels
    // clone the features list and when it reaches the end i will remove the first list and append the cloned list

    const featureList = document.querySelector("#features");
    const eachFeature = document.querySelector(".eachfeature");


    const featuresHeight = document.querySelector("#features").offsetHeight;
    const featuresCount = document.querySelectorAll(".eachfeature > li").length;

    const cloneEachFeature = eachFeature.cloneNode(true);
    featureList.appendChild(cloneEachFeature);

    let counter = 0;

    let topPosition = 0;
    setInterval(() =>
    {
        counter++;
        if (counter > featuresCount)
        {

            featureList.removeChild(featureList.firstElementChild);
            topPosition = 0;
            
            const clone = featureList.firstElementChild.cloneNode(true);
            featureList.insertAdjacentElement("beforeend", clone);
            featureList.style.top = topPosition;

            counter = 0;
        } else
        {
            const feature = document.querySelector(`.eachfeature > li:nth-child(${counter})`);

            feature.className = "highlight__feature";
            topPosition = `-${(featuresHeight / featuresCount) * counter}px`;
            setTimeout(() =>
            {
                featureList.style.top = topPosition;
            }, 1500);
        }



    }, 2500);



})();


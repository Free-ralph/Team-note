export const SlideVariant = {
    hide: {
      opacity: 0,
      x : -10
    },
    animate: {
      opacity: 1,
      x : 0,
      transition: {
        duration: 0.2,
        delay : 0.5,
        when: "beforeChildren",
        staggerChildren: 0.4,
      },
    },
  
    exit: {
        opacity: 0.4,
        x : 10,
        transition: {
            duration: 0.2,
            when: "beforeChildren",
            staggerChildren: 0.4,
          },
    //   scale : 1.4
    },
  };
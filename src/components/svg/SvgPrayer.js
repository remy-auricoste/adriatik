module.exports = function(SvgControl) {
  return params => {
    return (
      <SvgControl
        {...params}
        path="M261.78 18.063c-52.004 0-94.686 45.7-94.686 103.156 0 57.455 42.682 103.155 94.687 103.155 52.007 0 94.72-45.7 94.72-103.156 0-57.457-42.713-103.157-94.72-103.157zM203 159.655c13.276 3.67 26.394 6.046 39.375 7.22v18.75c-14.674-1.21-29.464-3.85-44.375-7.97l5-18zm117.375 0l4.906 18.03c-14.452 3.938-29.08 6.583-43.874 7.845v-18.718c13.085-1.223 26.055-3.638 38.97-7.156zM160.22 175.344c-75.308 50.797-110.604 125.208-116.282 220h.218c-.367 1.705-.562 3.466-.562 5.28 0 13.808 11.19 25 25 25 .22 0 .436-.025.656-.03v.22l179.438-.002V302.406c-25.58 4.82-45.22 28.49-45.22 62.594v9.344H103.096v-18.688h12.718c3.664-35.178 26.522-77.998 45.343-101.344l14.53 11.72c-15.618 19.373-36.603 61.664-40.905 89.624h50.47c4.04-42.08 35.168-72.875 73.22-72.875 34.98 0 68.653 28.958 73.905 72.876h55.75c-5.412-28.305-26.53-70.32-42.094-89.625l14.564-11.717c18.885 23.424 41.643 66.485 46.562 101.343h10.563v18.688H314.593l-.25-9.094c-1.02-35.656-23.57-58.234-46.97-62.875v123.438h180.657v-.22c.22.006.436.032.658.032 13.81 0 25-11.193 25-25 0-2.092-.266-4.12-.75-6.063-5.566-92.605-39.022-165.662-111.032-216.218-19.026 38.355-56.592 64.72-100.125 64.72-44.662 0-83.047-27.74-101.56-67.72zM140.374 444.5l9.188 47.5h220.562l8.47-47.5h-238.22z"
      />
    );
  };
};

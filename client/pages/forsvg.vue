<template>
  <div class="red">
    <canvas ref="canvas1"></canvas>
    <canvas ref="canvas2"></canvas>
    <svg ref="svg" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          asadasd <br />
          <h2 class="title">ssssssssssss</h2>
          fsdf<br /> sdfsd<br /> sdfsdfsdf<br />
        </div>
        <style>
          div{
            height: 600px;
            sfont-size:16px;
            background:gold;"
          }
                .title {
                  font-size: 40px;
                  color: red;
                }
        </style>
      </foreignObject>
    </svg>
  </div>
</template>

<script>
export default {
  mounted() {
    function wrapText(
      context,
      text,
      marginLeft,
      marginTop,
      maxWidth,
      lineHeight
    ) {
      var words = text.split(" ");
      var countWords = words.length;
      var line = "";

      for (var n = 0; n < countWords; n++) {
        var testLine = line + words[n] + " ";
        var testWidth = context.measureText(testLine).width;
        if (testWidth > maxWidth) {
          context.fillText(line, marginLeft, marginTop);
          line = words[n] + " ";
          marginTop += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, marginLeft, marginTop);
    }

    var canvas3 = this.$refs.canvas2;
    canvas3.height = 500;
    canvas3.width = 700;
    var context = canvas3.getContext("2d");
    var maxWidth = 700; //размер поле, где выводится текст
    var lineHeight = 25;
    /*если мы знаем высату текста, то мы можем
     предположить, что высота строки должна быть именно такой*/
    var marginLeft = 10;
    var marginTop = 20;
    var text =
      "Сначала мы разбиваем текст на слова по пробелам, а потом обходим эти слова в цикле, " +
      "обьединяя их по одному в строку. Если при последнем обьединении ширина этой строки меньше максимальной, " +
      "то продолжаем, а если больше, то выводим строку без последнего слова, а его записываем в новую строку." +
      "И так продолжаем, пока не обработаем весь текст.";

    context.font = "16pt Calibri";
    context.fillStyle = "#000";

    wrapText(context, text, marginLeft, marginTop, maxWidth, lineHeight);

    // eslint-disable-next-line no-unused-vars
    const data = `
     <svg xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" >
    asadasd <br />
    <h2 class="title">ssssssssssss</h2>
    fsdf<br />
    sdfsd<br />
    sdfsdfsdf<br />
    </div>
    <style>
    div{
      font-size:16px;
      background:gold;"
    }
          .title {
            font-size: 40px;
            color: red;
          }
          </style>
    </foreignObject>
    </svg>`;
    // eslint-disable-next-line no-unused-vars
    const data2 = this.$refs.svg;
    var img = new Image();
    var svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(svg);
    var ctx = this.$refs.canvas1.getContext("2d");
    // let text = ctx.measureText("Hello world");
    // console.log(text);
    // this.$refs.canvas1.height = 800;
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
    };

    img.src = url;
    // var ctx2 = this.$refs.canvas2.getContext("2d");
    // ctx2.drawImage(data2, 0, 0);
  },
};
</script>

<style lang="scss" scoped>
.red {
  background-color: rgb(255, 255, 255);
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="aboutContent">
    <h1>About source code graph analyzer</h1>

    <div class="blocktext">
      <p>
        Source code graph analyzer is a prototype of a web application for automated structure
        verification applied to any kind of source code according to user specifications.
      </p>
      <p>
        Two kinds of specifications supported. Importer describes how to parse some source code to
        import the information into graph database. Analysis describes a query to apply to that
        graph database so the answer could be given for weither some pattern presented in source
        data or not.
      </p>
      <p>
        Given specifications gathered into pipelines, each pipeline defining a set of importer to
        use for a sources and a set of analyzes to apply for a data being collected.
      </p>
      <p>
        A job can be started based on preliminarily created pipeline and a number source code texts
        being uploaded using job initiation dialog.
      </p>
      <p>
        After a job was started, the log of pipeline being working could be observed. When the job
        is finished, its log cointains information about how many data items were imported into
        database using which importers and what are the results of the given analyzses execution.
        Graph queries could also be manually executed on a collected data to evaluate some
        assumptions. For example while designing new analyzes.
      </p>
    </div>

    <div class="blocktext" style="font-weight: bolder; text-align: center; color: #aecf00">
      Join now and broad your mind!
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data: function () {
    return {
      // items: [
      //   { message: '', title: '1' },
      //   { message: 'Bar', title: '2' }
      // ]
    }
  }
}
</script>

<style scoped lang="scss">
div.blocktext {
  margin-left: auto;
  padding: 2%;
  margin-right: auto;
  width: 50%;
  text-align: left;
  font-size: larger;
}

h1 {
  margin-left: auto;
  margin-right: auto;
}

.aboutContent {
  margin: 3%;
}
</style>

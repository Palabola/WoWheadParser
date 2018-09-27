const Listview = require('./Whead-Listview');

let work_array = [];

let step = 0;

let start_id = 77557;

function async_fecth(thread) {

      setTimeout(() => {
         
        for(let i=0; i < thread;i++)
        {

          if(work_array[i] === undefined)
          {
            work_array[i] = new Listview(start_id+step);
            step++;
          }
          else
          {
            if(work_array[i].state == 1)
            {
              work_array[i] = new Listview(start_id+step);
              step++;
            } 
          }

          console.log(start_id+step);
        }

        async_fecth(thread);
      }, 1000);
      
  }
  

  async_fecth(20); // 20 Thread


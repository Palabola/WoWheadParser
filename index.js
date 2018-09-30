const Listview = require('./Whead-Listview');
const logger = require('./logger.js');


let timeout_limit = 10000; // in millisec

let thread_array = [];

let fecth_array = [48];

/*for (let index = 0; index < 155000; index++) {
  
  fecth_array.push(index);

}*/



function async_fecth(fecth_array,thread = 10,step = 0) {

      if(step > fecth_array.length)
      {
          logger.info('Parse finished, exit');
          return;
      }    
      else
      {
          logger.info('Update tick'+'step = '+fecth_array[step]);
      }

      setTimeout(() => {
         
        for(let i=0; i < thread;i++)
        {

          if(thread_array[i] === undefined) // Fill the threads at startup
          {
            thread_array[i] = new Listview(fecth_array[step]);
            step++;
          }
          else
          {
            if(thread_array[i].state == 1) // Re-init executed threads
            {
              thread_array[i] = new Listview(fecth_array[step]);
              step++;
            }
           
            if(thread_array[i].time_created + timeout_limit < Date.now())  // Cleanup timeout
            {
              thread_array[i] = new Listview(fecth_array[step]);
              step++;
            }
          }
        }


        async_fecth(fecth_array,thread,step);

      }, 4000);
      
  }
  

  async_fecth(fecth_array); // Y Thread count


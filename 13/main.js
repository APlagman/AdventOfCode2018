const sample = String.raw`/->-\        
|   |  /----\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/   `;
const sample2 = String.raw`/>-<\  
|   |  
| /<+-\
| | | v
\>+</ |
  |   ^
  \<->/`;
const input = String.raw`                                               /---------\                                                                                            
                                               |         |/---------------\                                                                           
        /--------------------------------------+---------++---------------+-----------------------------\                                             
        |                      /---------------+---------++-------------<-+----------------------------\|                                             
   /----+----------------------+------\        |         ||               |                            ||                                             
   |    |                      |      |        |         ||               |                            ||  /-------------------------------------\    
   |    |                      |      |        |         ||               |                            ||  |                                     |    
   |    |    /-----------------+------+--------+---------++---------------+-------\              /-----++--+-------------------------------------+-\  
   |    |    |        /--------+------+--------+---------++-------------\ |       |              |     ||  |                           /---------+\|  
   |    |    |        |        |      |        |         ||        /----+-+-------+--------------+-\  /++--+---------------------------+---------+++\ 
   |    |    |    /---+--------+------+--------+-----\   ||      /-+----+-+-------+--------------+-+--+++--+-----------\               |         |||| 
   |    |    |    |   |        |      |        |     |   ||      | |    | |       |              | |  |||  |           |               |         |||| 
   |    |    |    |  /+--------+------+--------+---\ |   ||      | |    | |       |              | |  |||  |           |               |         |||| 
   |    |    |    |  ||        |      |        |   | |   ||      | |    | |       | /------------+-+--+++--+------\    |               |         |||| 
   |    |    |/---+--++--------+-----\|        | /-+-+---++------+-+----+-+-----\/+-+------------+-+--+++--+------+----+-\             |         |||| 
   |    |   /++---+--++--------+-----++--\     | | | |   ||      | |    | |     |||/+------------+-+--+++--+------+----+-+-------------+---------++++\
   |    |   |||   |  ||  /-----+-----++--+-----+-+-+-+---++-\    | |    | |     |||||         /--+-+--+++--+------+----+-+-------------+------\  |||||
   | /--+---+++---+--++--+-----+-----++--+-----+-+-+-+---++-+----+-+----+-+-----+++++-------\ |  | |  |||  |      |    | |             \-<----+--+/|||
   | |/-+---+++---+--++--+-----+--\  ||  |     | | | |   || |    | |    | |     |||||       | |  \-+--+++--+------+----+-+--------------------+--+-/||
   | || |   |||   |  ||  |     |  |  ||  |     | | | |   ||/+----+-+----+-+-----+++++-------+-+----+--+++--+------+----+-+--------------\     |  |  ||
   | || |   |||   |  ||  |    /+--+--++--+-----+-+-+-+---++++----+-+----+-+-----+++++-------+-+----+--+++--+------+----+\|              |     |  |  ||
   | || |   |||   |  ||  |    ||  |  ||  |     | | | | /-++++----+-+----+-+-----+++++-------+-+----+--+++--+------+----+++----\         |     |  |  ||
   | || |   |||   |  ||/-+----++--+--++--+-----+-+-+-+-+-++++----+-+----+-+----\|||||       | |    |  \++--+------+----+++----+---------+-----+--+--/|
   | || |   |||   \--+++-+----++--+--++--+-----+-+-+-/ | ||||    | |    | |/---++++++-------+-+----+---++--+------+----+++----+--------\|     |  |   |
   | || |   |||      ||| |    ||  |  ||  |     | | |   | |\++----+-+----+-/|   ||||||       | |    |   ||/-+------+\   |||    |        ||     |  |   |
   | || |   |||      ||| |    ||  |  ||  |     | | |   | | || /--+-+----+--+-\ ||||||       | |    |   ||| |      ||   |||    |        ||     |  |   |
   | || | /-+++------+++-+----++\ |  ||  |     | | |   | | || |  | |    | /+-+-++++++-------+-+----+---+++-+------++---+++----+--------++\    |  |   |
   | || | | |||      |\+-+----+++-+--++--+-----+-+-+---+-+-++-+--+-+----/ || | ||||||       | |    |   ||| |      ||   |||    |        |||    |  |   |
   | || | | |||      | | |    ||| |  ||  |     | | |   | | || |  | \------++-+-++++++-------+-+----/   ||| |      ||   |||    |        |||    |  |   |
   | || | | |||    /-+-+-+----+++-+--++--+-----+-+-+---+-+-++\|  |     /--++-+-++++++-------+-+--------+++-+----\ ||   |||    |        |||    |  |   |
   | || | | |||    | | | |    ||| |  ||  |     | | |   | | ||||  |     |  || | ||||||       | |   /----+++-+-\  | ||   |||    |        |||    |  |   |
   | || | | |||  /-+-+-+-+----+++-+--++--+-----+-+-+---+-+-++++--+-----+--++-+-++++++-------+-+---+----+++-+\|  | ||   |||    |        |||    |  |   |
   | || | | ||v  | v | | |    ||| |  ||  |     | | |   | | ||||  |     |  || | ||||||   /---+-+---+----+++-+++--+-++---+++----+-\      |||    |  |   |
   | || | | |||  | | | | |    ||| |  ||  |     | | | /-+-+-++++--+-----+--++-+-++++++---+---+-+---+----+++-+++--+-++---+++----+-+--\   |||    |  |   |
   | || | | |||  | | | | |    ||| |  ||  |     | | | | |/+-++++--+-----+--++-+-++++++---+---+-+---+----+++-+++--+-++---+++----+-+--+---+++----+--+\  |
   | || | | |||  | | | | |    ||| |  ||  |     | \-+-+-+++-++++--+-----+--++-+-+/||||   |   | \---+----+++-+++--+-++---+++----+-+--+---+++----/  ||  |
   | || | | |||  | | | | |    ||| |  ||  |     |   | | ||| |||| /+-----+--++-+-+-++++---+---+-----+----+++-+++--+-++---+++----+-+--+---+++----\  ||  |
   | || | | |||  | | | | |    ||| |  ||  |     |   | | ||| |||| ||    /+--++-+-+-++++---+---+-----+---\||| |||  |/++---+++----+-+--+\  |||    |  ||  |
   | || | | |||  | | | | |    |||/+--++--+\    |   | | ||| |||| ||    ||  || |/+-++++---+---+-----+---++++-+++--++++---+++----+-+--++--+++---\|  ||  |
/--+-++-+-+-+++--+-+-+-+-+----+++++\ ||  ||    |   | | ||| |||| ||    ||  || ||| ||||   | /-+-----+---++++-+++--++++---+++----+-+--++\ |||   ||  ||  |
|  | || | | |||  | | | | |    |||||| || /++----+---+-+-+++-++++-++----++--++-+++-++++---+-+-+-----+---++++-+++\ ||||   |||    | |  ||| |||   ||  ||  |
|  | || | | |||  | | | | |    |||||| || |||  /-+---+-+-+++-++++-++----++--++-+++-++++---+\| |     |   |||\-++++-+++/   |||/---+-+--+++-+++---++\ ||  |
|  | || | | |||  | | | | |    |||||| || |||  | |   | | ||| |||| ||    ||  || ||| ||||   ||| |     |   |||  |||| |||    ||||   | |  ||| |||   ||| ||  |
|  | ||/+-+-+++--+-+-+-+-+----++++++-++-+++\ | |  /+-+-+++-++++-++----++--++-+++-++++---+++-+-----+---+++--++++-+++----++++---+-+--+++-+++-\ ||| ||  |
| /+-++++-+-+++--+-+-+-+-+----++++++-++-++++-+-+--++-+-+++-++++-++---\||  || ||| ||||   ||| |     |   |||  |||| |||    ||||   | |  ||| ||| | ||| ||  |
| || |||| | |||  | | | | |    |||||| || ||||/+-+--++-+-+++-++++-++---+++--++-+++-++++---+++-+-----+---+++--++++-+++----++++---+-+--+++-+++-+\||| ||  |
| || |||| | |||  | | | | |    |||||| || |||||| |  || | ||| |||| ||   |||  || ||| ||||   ||| |     |   |||  |||| |||    ||^|   | |  ||| ||| ||||| ||  |
| || |||| | |||  | | | | |    |||||| || |||||| |  || | |||/++++-++---+++--++-+++-++++--\||| |     |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | |||  | | | | |    |||||| ||/++++++-+--++-+-++++++++-++---+++--++-+++-++++--++++-+--\  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | |||  | | | | |    |||||| ||||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | |||  | | | | |    |||||| ||||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | |||  | | | | |    |||||| ||||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | |||  | | | | |    |||||| ||||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | ||\--+-+-+-+-+----++++++-/|||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | ||   | | | | |    ||||||  |||||||| | /++-+-++++++++-++---+++--++-+++-++++--++++-+--+--+---+++-\|||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | ||   | | | \-+----++++++--++++++++-+-+++-+-++++++++-++---+++--++-++/ ||||  |||| |  |  |   ||| ||||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | ||   | | |   |    ||||||  |||||||| | ||| | |||||||| || /-+++--++-++--++++--++++-+--+-\|   ||| ||||| |||    ||||   | |  ||| ||| ||||| ||  |
| || |||| | ||   | | |   |    \+++++--++++++++-+-+++-+-++++++++-++-+-+++--++-++--++++--++++-+--+-++---+++-+++++-+++----+/||   | |  ||| ||| ||||| ||  |
| || |||| | ||/--+-+-+---+\    |||||  |||||||| \-+++-+-++/||||| || | |||  || ||  ||||  |||| |  | ||   ||| ||||| |||    | |\---+-+--+++-+++-++++/ ||  |
| || |||| | |||  | | |   v|    |||||  ||||||||   ||| | || ||||| ||/+-+++--++-++--++++--++++-+--+-++--\||| ||||| |||    | |    | |  ||| ||| ||||  ||  |
|/++-++++-+-+++--+-+-+---++----+++++--++++++++---+++-+-++-+++++-++++-+++--++-++--++++--++++-+--+-++--++++\||||| |||    | |    | |  ||| ||| ||||  ||  |
|||| |||| | |||  | | |   ||    |||||  |^||||||   |||/+-++-+++++-++++\|||  |\-++--++++--++++-+--+-++--++++++++++-+++----+-+----+-+--+++-/|| ||||  ||  |
|||| |||| | |||  | | |/--++----+++++--++++++++---+++++-++-+++++-++++++++--+--++--++++--++++-+--+-++--++++++++++-+++----+\|    | |  |||  || ||||  ||  |
|||| |||| | |||  |/+-++--++-\  |||||  ||||||||   ||||| \+-+++++-++++++++--+--++--++++--++++-+--+-++--++++++++++-+++----+++----/ |  |||  || ||||  ||  |
|||| |||| | |||  ||| ||  || |  |||||/-++++++++---+++++--+-+++++-++++++++--+--++>-++++--++++-+--+-++-\|||||||||| |||    |||      |  |||  || ||||  ||  |
|||| |||| | |||  ||| ||  || |  |||||| ||||||||   |||||  | ||||| ||||||||  |  ||  ||||  |||| |  | || ||||||||||| |||   /+++------+--+++--++-++++-\||  |
|v|| |||| | |||  ||| ||  || |  |||||| ||||||||   |||||  | ||||| ||||||||  |  ||  ||||  |||| |  | || ||||||||||| |||   ||||      |  |||  || |||| |||  |
|||\-++++-+-+++--+++-++--++-+--++++++-/|||||||   |||||  | |||||/++++++++--+--++--++++-\|||| |  | || ||||||||||| |||   ||||      |  |||  || |||| |||  |
|||  |||| | |||/-+++-++--++-+--++++++--+++++++---+++++-\| ||||||||||||||  |  ||  |||| ||||| |  | || |||||||\+++-+++---++++------+--+++--++-++++-+/|  |
|||  |||| | |||| ||| ||  \+-+--++++++--+++++++---+++++-++-++/|||||||||||  | /++--++++-+++++-+--+-++-+++++++-+++-+++---++++-----\|  |||  || |||| | |  |
|||  |||| | |||| ||| ||   | |  ||||||  |||||||   ||||| || || |||||||||||  | |||  |||| ||||| |  | ||/+++++++-+++-+++--\||||     ||  |||  || |||| | |  |
||| /++++-+-++++-+++\||   | |  \+++++--+++++++---+++++-++-++-+++++++++++--+-+++--++++-+++++-+--+-++++++/||| ||| |||  |||||  /--++--+++\ || |||| | |  |
||| ||||| \-++++-++++++---+-+---/||||  |||||||   ||||| || || |||||||v|||  | |||  |||| ||||| |  | |\++++-+++-+/| |||  |||||  |  ||  |||| || |||| | |  |
|\+-+++++---++++-++++++---+-+----++++--+++++++---+++++-++-++-+++++++++++--+-+++--++++-+++++-+--+-+-++++-+/| | | |||  |||||  |  ||  |||| || |||| | |  |
| | |||||   |||| ||||||   | |    ||||  |||||||   ||||| || || |||||||||||  | |||  \+++-+++++-+--+-+-++++-+-+-+-+-+++--++++/  |  ||  |||| || |||| | |  |
| | |||||   |||| ||||||   | |    ||||  |||||||   ||||| || || |||||||||||  | |||   |||/+++++-+--+-+-++++-+-+-+-+-+++--++++---+--++\ |||| || |||| | |  |
| | |||||   |||| ||||||   | |    ||||  |||||\+---+++++-++-++-+++++++++++--+-+++---+++++++++-+--+-+-++++-+-+-+-+-+++--++++---+--+++-++++-++-+/|| | |  |
| | |||||   |||| ||||||   | |/---++++--+++++-+---+++++-++-++-+++++++++++--+-+++---+++++++++-+--+-+-++++-+-+-+-+-+++--++++---+\ ||| |||| || | || | |  |
| | |||||   |||| ||||||   | ||/--++++--+++++-+---+++++-++-++-+++++++++++--+-+++-\ ||||||||| |  | | |||| | | | | |\+--++++---++-+++-+/|| || | || | |  |
| | |||||   |||| ||||||   | |||  ||||  ||||| |   ||||| || || |||||||||||  | ||| | ||||||\++-+--+-+-++++-+-+-+-+-+-+--++++---++-+/| | || || | || | |  |
| | |||||   |||| ||||||   | |||  ||||  ||||| |   ||||| || || |||||||||||  | ||| | |^|||| |\-+--+-+-++++-+-+-+-+-+-+--++++---++-+-+-+-/| || | || | |  |
| | |||||   |||| ||||||   | |||  ||||  ||||| |   ||||| || || ||||||||||| /+-+++-+-++++++-+--+--+-+-++++-+-+-+-+-+-+--++++---++-+-+-+--+-++-+-++-+\|  |
| | |||||   |\++-++++++---+-+++--++++--+++++-+---+++++-++-++-+++++++++++-++-+++-+-/||||| |  |  | | |||| | | | | | |  ||||   || | | |  | || | || |||  |
| | |||||   | || ||||||   | |||  ||||  ||||| |   ||||| || || ||||||||||| || ||| |  ||||| |  |  | | |||| | | | | | |  ||||   \+-+-+-+--/ || | || |||  |
| | \++++---+-++-+++/||   | |||  ||||  ||||| |   ||||| || || ||||||||||| || ||| |  ||||| |  |  | | |||| | | | | | |  ||||    | | | |    || | || |||  |
| |  ||||   | || ||| ||   | |||  ||||  ||||| |   ||||| || ||/+++++++++++-++-+++-+--+++++-+--+--+-+-++++-+-+-+-+-+-+--++++----+\| | |    || | || |||  |
| | /++++---+-++-+++\||/--+-+++--++++--+++++-+---+++++-++\||||||||||||\+-++-+++-+--+++++-+--+--+-+-+++/ | | | | | |  ||||    ||| | |    || | || |||  |
| | |||||   | || ||||||| /+-+++--++++--+++++-+---+++++-+++++++++++++++-+-++-+++-+\ ||||| |  |  | | |||  | | | | | |  ||||    ||| | |    || | || |||  |
|/+-+++++--\| || |||||||/++-+++--++++-\||||| |   ||||| ||||||||||||||| | || ||| || \++++-+--+--+-+-+++--+-+-+-+-+-+--++++----+++-+-+----++-+-++-+++--/
||| ||||\--++-++-++++++++++-+++--++++-++++++-+---+++++-+++++++++++++++-+-++-+++-++--++++-+--+--+-+-+++--/ | | | | |  |\++----+++-+-+----++-+-++-/||   
||| ||||   || || ||||\+++++-+++--++++-++++++-+---++/|| ||||||||||||||| | || ||| ||  |||| |  |  | | |||    | | | | |  | ||    ||| | |    || | ||  ||   
||| ||||   || || |||| ||||| |||  |||| |||||| |   || || ||||||||||||||| | || ||| ||  |||| |  |  | | |||    | | | | |  | ||   /+++-+-+---\|| | ||  ||   
||| ||||   || || |||| ||||| |||  ||||/++++++-+---++-++-+++++++++++++++-+-++-+++-++--++++-+--+--+-+-+++----+-+-+-+-+--+-++->-++++\| |   ||| | ||  ||   
||| ||||   || || |||| ||||| |||  ||||||||||| |   ||/++-+++++++++++++++-+-++-+++-++--++++-+--+--+-+-+++----+-+-+-+-+--+-++---++++++-+---+++-+-++--++-\ 
||| ||||   || || |||| ||||| |||  ||||||||||| |   ||||| |||||\+++++++++-+-++-+++-++--++++-+--+--+-+-+++----+-+-+-+-+--+-++---++/||| |   ||| | ||  || | 
||| ||||   || || |||| ||||| |||  ||||||||||| |   ||||\-+++++-+++++++++-+-++-+++-++--++++-+--+--+-+-+++----+-+-+-+-+--+-++---++-+++-/   ||| | ||  || | 
||| ||||   || || |||| ||||| |||  \++++++++/| |   ||||  ||||| ||||||||| | ||/+++-++--++++-+--+-\| | |||    | | | | |  | ||/--++-+++---\ ||| | ||  || | 
||| ||\+---++-++-++++-+++++-+++---/||||||| | |   ||||  ||||| ||||||||| | |||||| ||  |||| |  | || | |||    | | | | |  | |||  || |||   | ||| v ||  || | 
||| |\-+---++-++-++++-+++++-+++----+++++++-+-+---++++--+++++-+++++++++-+-++++++-++--++++-+--/ || | |||    | | | | |  | |||  || |||   | ||| | ||  || | 
||| |  |   || || |v|| ||||| |||    ||||||| | |   ||||  ||||| ||||||||| | \+++++-++--++++-+----++-+-+++----+-+-+-+-+--+-+++--++-+++---+-+++-+-++--/| | 
||| |  |   || || |||| ||||| |||    ||||||| | |   ||||  ||||| ||||\++++-+--+++++-++--++++-+----++-+-+++----+-+-+-+-+--+-/||  || |||   | ||| | ||   | | 
||| \--+---++-++-+++/ ||||| |||    ||||||| | |   ||||  |||\+-++++-++++-+--+++++-++--+++/ |    || | |||    | | | | |  |  ||  || |||   | ||| | ||   | | 
|||    |   || || |||  |||\+-+++----+++++++-+-+---++++--+++-+-++++-++++-+--+++++-+/ /+++--+----++-+-+++----+-+-+-+-+--+--++--++-+++---+-+++-+\||   | | 
|||    | /-++-++-+++--+++-+-+++----+++++++-+-+---++++--+++-+-++++-++++-+--+++++-+--++++--+----++-+-+++----+-+-+\| |  |  ||  || |||   | ||| ||||   | | 
|||    | | || || |||  ||| | |||    ||||||| | \---++++--+++-+-++++-++++-+--+++++-+--++++--/    || | |||    | | ||| |  |  ||  || |||   | ||| ||||   | | 
|||    | | || || |||  ||| | v||/---+++++++-+-----++++-\||| | |||| |||| |  ||||\-+--++++-------++-+-+++----+-+-+++-+--+--++--++-+++---+-+++-++/|   | | 
|||    | | |\-++-+++--+++-+-++++---++++++/ |     |||| |||| | |\++-++++-+--+++/  |/-++++-------++-+-+++----+-+-+++-+--+-\||  || |||   | ||| || |   | | 
|||    | | |  || |||  ||| | ||\+---++++++--+-----++++-++++-+-+-++-++++-+--+++---/| ||||       || |/+++--->+-+-+++-+--+-+++--++\|||   | ||| || |   | | 
|||    | | |  || |||  ||| | || |   ||||||  |     |||| |||| | | || |||| |  |||    | ||||       || |||^|  /-+-+-+++-+--+-+++--++++++---+-+++-++-+---+\| 
|||    | | |  || |||  ||| | || |   ||||||  |     |||| ||\+-+-+-++-++++-+--+++----+-++++-------++-+++++--+-+-+-+++-+--+-+++--++++++---+-+++-++-+---/|| 
|||    | | |  || |||  ||| | || |   |||||\--+-----++++-++-+-+-+-++-++++-+--+++----+-++++-------++-+++++--+-+-+-/|| |  | |||  ||||||   | ||| || |    || 
|||    | | |  || |||  ||| | || |   |||||   |     \+++-++-+-+-+-++-++++-+--+++----+-++++-------++-+++++--+-/ |  || |  | |||  ||||||/--+-+++-++-+-\  || 
|||    | | |  || |||  ||| | || |   |||||   |      ||| || | | | || |||| \--+++----+-++++-------++-+++++--+---+--+/ |  | |||  |||||||  | ||| || | |  || 
|||    |/+-+--++-+++--+++-+-++-+---+++++--\|      ||| || | | | || ||||    |||    | |\++-------++-+++++--+---+--+--/  | |||  |||||||  | ||| || | |  || 
|||    ||| |  || |||  ||| | || |   |||||  ||      ||| || | | | || \+++----+++----+-+-++-------++-++++/  |   |  |     | |||  |||||||  | ||| || | |  || 
|||    ||| |  ||/+++--+++-+-++-+---+++++--++------+++-++-+-+-+-++--+++----+++----+-+-++-------++-++++---+---+--+-----+\|||  \++++++--+-/|| || | |  || 
|||    ||| |  ||||||  ||| | || |   |||||  ||      |\+-++-+-+-+-++--+++----+++----+-+-++-------++-++++---+---+--+-----+++++---++++++--+--++-++-+-+--+/ 
|||    ||| |  ||||||  ||| | || |   |||||  ||      | | || | | | ||  |||    \++----+-+-++-------++-++++---+---+--+-----+++++---++++++--+--+/ || | |  |  
|||    ||| |  ||||||  ||| | || \---+++++--++------+-+-/| | | | ||  |||     ||    | | ||       || ||||   |   |  |     |||||   ||||||  |  |  || | |  |  
|||    ||| |  |||||\--+++-+-++-----+++++--++------+-+--+-+-+-/ ||  |||     ||    | | \+-------++-++++---+---+--+-----+++++---++++/|  |  |  || | |  |  
|||    ||| |  |||||  /+++-+-++-----+++++--++------+-+--+-+-+---++--+++-----++----+-+--+----\  || ||||   |   |  |     |||||   |||| |  |  |  || | |  |  
|||    ||| |/-+++++--++++-+-++-----+++++--++------+-+--+-+-+---++--+++----\||    | |  |    |  || ||||   |   |  |     |||||   |||| |  |  |  || | |  |  
||\----+++-++-+++++--++++-+-++-----+++++--++------+-+--+-+-+---++--++/    |||    | |  |    |  || ||||   |   |  |     |||||   |||| |  |  |  || | |  |  
||     |||/++-+++++--++++-+-++-\   |||||  ||      | |  | | \---++--++-----+++----+-+--+----+--++-++++---+---+--+-----+++++---++++-+--+--/  || | |  |  
||     |||||| |||||  |||| | || |   |||||  ||      \-+--+-+-----++--++-----+++----+-+--+----+--++-++++---+---+--+-----+++++---++++-+--+-----/| | |  |  
||     |||||| |||||  |||| | || |   |||||  ||        |  | |     ||  ||     |||    | |  |    |  || ||||   |   |  |     |||||   |||| |  |      | | |  |  
||     |||||| |||||  |||| | || |   ||\++--++--------+--+-+-----++--++-----+++----+-+--+----+--++-++++---+---+--+-----+++++---+++/ |  |      | | |  |  
||     ||\+++-+++++--++++-+-++-+---++-++--++--------+--+-+-----++--++-----+++----+-+--+----+--++-++++---+---+--/     |||||   |||  |  |      | | |  |  
||     || ||| |||\+--++++-+-++-+---++-++--++--------+--+-+-----++--++-----+++----+-+--+----+--++-++++---+---/        |||||   |||  |  |      | | |  |  
|\-----++-+/| ||| |  |||| | || |   || ||  ||        |  | |     ||  ||  /--+++----+-+--+----+\ || ||||   \------------+++++---+++--+--+------+-+-+--/  
|      || | | ||| \--++++-+-/| |   || ||  ||        |  | |     ||  ||  |  |||    | \--+----++-++-++++----------------+++++---+++--+--+------/ | |     
|      || | | |\+----++++-+--+-+---++-++--++--------+--/ |     ||  ||  |  ||\----+----+----++-++-++++----------------+++++---++/  |  |        | |     
|      || | | | |    |||| |  | |   |\-++--++--------+----+-----++--++--+--++-----+----+----++-++-+++/                |||||   ||   |  |        | |     
|      || | | | |    |||\-+--+-+---+--/|  ||        |    |     ||  ||  |  ||     |    |    || || ||\-----------------/||||   ||   |  |        | |     
|      || | | \-+----+++--/  | |   |   |  ||        |    |     ||  ||  |  ||     |    |    || || ||                   ||||   ||   |  |        | |     
|      || \-+---+----+++-----+-/   |   |  ||        |    |     \+--++--+--++-----+----/    || || ||                   ||||   ||   |  |        | |     
|      |\---+---+----+++-----+-----+---+--/|        |    |      \--++--+--++-----+---------++-++-++-------------------++++---++---+--+--------/ |     
|      |    |   |    |\+-----+-----+---+---+--------+----+---------++--+--++-----+---------++-++-++-------------------++/\---++---+--/          |     
|      |    |   |    \-+-----+-----+---+---+--------+----+---------++--+--++-----+---------/| || ||                   ||     ||   |             |     
|      |    |   |      |     |     |   |   |        |    |         ||  |  ||     |          | || ||                   ||     ||   |             |     
\------+----+---+------+-----+-----/   |   |        |    |         ||  |  ||     \----------+-++-++-------------------+/     ||   |             |     
       |    |   |      |     \---------+---+--------+----+---------++--+--++----------------+-++-++-------------------+------/|   |             |     
       |    |   |      \---------------+---+--------+----/         ||  |  ||                | || ||                   |       |   |             |     
       |    |   |                      |   |        |              ||  |  |\----------------+-/| ||                   |       |   |             |     
       |    |   |                      |   |        \--------------+/  \--+-----------------/  | ||                   |       |   \-------------/     
       |    |   |                      |   |                       \------+--------------------+-/|                   |       |                       
       |    |   |                      \---+------------------------------+--------------------/  |                   |       |                       
       \----+---+--------------------------/                              |                       \-------------------+-------/                       
            \---+---------------------------------------------------------/                                           |                               
                \-----------------------------------------------------------------------------------------------------/                               `;

const NONE = -1;
const HORIZONTAL = 0;
const VERTICAL = 1;
const INTERSECTION = 2;
const LEFTSLANT = 3;
const RIGHTSLANT = 4;

const LEFT = 0;
const STRAIGHT = 1;
const RIGHT = 2;
const NUM_TURNS = 3;
const UP = 3;
const DOWN = 4;

const turns = new Map();
turns.set(LEFT * 10 + STRAIGHT, LEFT);
turns.set(RIGHT * 10 + STRAIGHT, RIGHT);
turns.set(UP * 10 + STRAIGHT, UP);
turns.set(DOWN * 10 + STRAIGHT, DOWN);

turns.set(LEFT * 10 + LEFT, DOWN);
turns.set(RIGHT * 10 + LEFT, UP);
turns.set(UP * 10 + LEFT, LEFT);
turns.set(DOWN * 10 + LEFT, RIGHT);

turns.set(LEFT * 10 + RIGHT, UP);
turns.set(RIGHT * 10 + RIGHT, DOWN);
turns.set(UP * 10 + RIGHT, RIGHT);
turns.set(DOWN * 10 + RIGHT, LEFT);

const deltas = new Map();
deltas.set(LEFT, [-1, 0]);
deltas.set(RIGHT, [1, 0]);
deltas.set(UP, [0, -1]);
deltas.set(DOWN, [0, 1]);

function doTick(cart, grid) {
    const delta = deltas.get(cart.direction);
    const nextPosition = {
        x: cart.x + delta[0],
        y: cart.y + delta[1]
    };

    cart.x = nextPosition.x;
    cart.y = nextPosition.y;

    const cellType = grid[nextPosition.y][nextPosition.x];
    if (cellType == INTERSECTION) { // +
        cart.direction = directionAfterTurn(cart.direction, cart.nextTurn);
        cart.nextTurn = (cart.nextTurn + 1) % NUM_TURNS;
    }
    else if (cellType == LEFTSLANT) { // /
        switch (cart.direction) {
            case LEFT:
                cart.direction = DOWN;
                break;
            case UP:
                cart.direction = RIGHT;
                break;
            case RIGHT:
                cart.direction = UP;
                break;
            case DOWN:
                cart.direction = LEFT;
                break;
        }
    }
    else if (cellType == RIGHTSLANT) { // \
        switch (cart.direction) {
            case LEFT:
                cart.direction = UP;
                break;
            case UP:
                cart.direction = LEFT;
                break;
            case RIGHT:
                cart.direction = DOWN;
                break;
            case DOWN:
                cart.direction = RIGHT;
                break;
        }
    }
}

function directionAfterTurn(currentDirection, turnDirection) {
    return turns.get(currentDirection * 10 + turnDirection);
}

function toCharDirection(val) {
    if (val === UP)
        return "^";
    if (val === DOWN)
        return "v";
    if (val === LEFT)
        return "<";
    if (val === RIGHT)
        return ">";
}
function toCharCell(val) {
    if (val === VERTICAL)
        return "|";
    if (val === HORIZONTAL)
        return "-";
    if (val === LEFTSLANT)
        return "/";
    if (val === RIGHTSLANT)
        return `\\`;
    if (val === INTERSECTION)
        return "+";
    return " ";
}

function gridToString(grid, carts) {
    return grid.reduce((str, row, y) => {
        return row.reduce((str, cell, x) => {
            const cartFound = carts.findIndex(cart =>
                cart.x === x && cart.y === y);
            if (cartFound >= 0) {
                const cartFound2nd = carts.findIndex((cart, i) =>
                    i !== cartFound && cart.x === x && cart.y === y);
                if (cartFound2nd >= 0) {
                    return str + 'X';
                }
                return str + toCharDirection(carts[cartFound].direction);
            }
            return str + toCharCell(cell);
        }, str) + "\n";
    }, "");
}

function parseGrid(input, carts) {
    // 2D array of cell types
    return input.split('\n')
    .map((line, y) => 
        line.split('')
        .map((char, x) => {
            let pos = NONE;
            switch (char) {
                default:
                    break;
                case '+':
                    pos = INTERSECTION;
                    break;
                case '-':
                    pos = HORIZONTAL;
                    break;
                case '|':
                    pos = VERTICAL;
                    break;
                case '\\':
                    pos = RIGHTSLANT;
                    break;
                case '/':
                    pos = LEFTSLANT;
                    break;
                case 'v':
                    carts.push({ x: x, y: y, direction: DOWN, nextTurn: LEFT });
                    pos = VERTICAL;
                    break;
                case '^':
                    carts.push({ x: x, y: y, direction: UP, nextTurn: LEFT });
                    pos = VERTICAL;
                    break;
                case '>':
                    carts.push({ x: x, y: y, direction: RIGHT, nextTurn: LEFT });
                    pos = HORIZONTAL;
                    break;
                case '<':
                    carts.push({ x: x, y: y, direction: LEFT, nextTurn: LEFT });
                    pos = HORIZONTAL;
                    break;
            }
            return pos;
        })
    );
}

function day13(input, reportCrash) {
    let carts = [];
    const grid = parseGrid(input, carts);

    let currentTick = 0;
    let firstCrash = null;
    while (firstCrash == null || (!reportCrash && carts.length > 1)) {
        // Sort Top->Bottom, Left->Right 
        carts.sort((a,b) => {
            if (a.y === b.y)
                return a.x - b.x;
            return a.y - b.y;
        });

        // Update carts
        for (let cartIndex = 0; cartIndex < carts.length; ++cartIndex) {
            if (carts[cartIndex] == null)
                continue;

            doTick(carts[cartIndex], grid);
            
            // Check for crash
            const crashedIndex = carts.findIndex((other, i) =>
                other != null &&
                cartIndex !== i &&
                other.x === carts[cartIndex].x &&
                other.y === carts[cartIndex].y);
            if (crashedIndex >= 0) {
                firstCrash = [carts[cartIndex].x, carts[cartIndex].y];

                // Remove crashed carts
                if (!reportCrash) {
                    carts[cartIndex] = null;
                    carts[crashedIndex] = null;
                }
            }
        }

        // Remove null carts
        carts = carts.reduce((filtered, next) => {
            if (next != null)
                filtered.push(next);
            return filtered;
        }, []);

        ++currentTick;
    }
    // carts[0] is the last cart if the rest crashed
    return reportCrash ? firstCrash : [carts[0].x, carts[0].y];
}

console.log(`Sample\tPart 1: ${day13(sample, true)}\tPart 2: ${day13(sample2, false)}`);
console.log(`Input\tPart 1: ${day13(input, true)}\tPart 2: ${day13(input, false)}`);
# Design

## dependency
* glob
* chokidar: https://github.com/paulmillr/chokidar
* 

## Main Goal
* ~~easy access files and directories in a given project~~
    * ~~use util to change the origin filename to an easy access one in code~~
        * ~~also reserve the original name?~~
        * ~~the way to turn origin filename to easy access filename should be config~~
        * ~~when using easy access to access children, we initial the sub directory implicitly, so we can continue this access accordingly~~
        * ~~[? is it a good idea to initialize them?]can use path to access specific Directory/File, initialize according Parent Directory~~
* provide utilities functions on each given node    
    * check file properties
        * type of node (dir or file)
        * ext
        * basename
        * [optional]size
        * [optional]modified time
    * path access to children
    * use glob to search and get desired files
                * find single file
                * find all file
    * create/modify file, directories, bundle(pack of file)
    * watch file change
        * provide file watcher interface on each node level
        
* lazy load content
    * lazy load non-direct children file and folder
    * lazy load file content
    * do we need to lazy load all ancestor Node when file change?
    * lazy update file change in memory model on when file is activate
    
* emit File CRUD event to outside
    * internal event (change file or directory by easy-fs api)
    * external event (change file or directory outside easy-fs)
    * update directory model only when you bind event on it
    * update all file $isDirty any time file change
* advanced
    * exclude some files/directories from project
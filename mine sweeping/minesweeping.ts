enum userCheckFlag {
    mine_flag = 1,
    mine_flag_maybe = 2
}
interface Point {
    x: number;
    y: number;
}
interface mineRng {
    mineNerbArray: Array<mineRng>;
    isOpened: boolean;
    userFlag: userCheckFlag
    isMine: boolean;
    id: number;
    mineRngPointArray: Array<Point>;
}
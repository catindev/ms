module.exports = () => {
    let beforeOneWeek = new Date( new Date().getTime() - 60 * 60 * 24 * 7 * 1000 )
        , day = beforeOneWeek.getDay()
        , diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
        , start = new Date( beforeOneWeek.setDate( diffToMonday ) )
        , end = new Date( beforeOneWeek.setDate( diffToMonday + 6 ) )
        ;
    return { start, end };
};

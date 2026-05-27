<script lang="ts">
</script>

<template lang="html">
    <div class="navbar-container">
        <div class="nav-item left">
            <div class="icon24 mi-warehouse logo-menu"></div>
            <div class="home">
                <div class="app-logo"></div>
                <div class="app-text">Sản xuất</div>
            </div>
        </div>
        <div class="nav-item right">
            <div class="nav-item-content">
                <div class="item-content nav-item-content-left">
                    <span class="name-company-title">Công ty cổ phần MISA Test - 345</span>
                    <span class="icon-menu mi-warehouse icon16 angle-down-small"></span>
                </div>
                <div class="item-content nav-item-content-right">
                    <div class="icon-function-nav icon-nav-hover export">
                        <div class="icon mi-awh icon24 download-status">
                        </div>
                    </div>
                    <div class="icon-function-nav icon-nav-hover export">
                        <div class="icon mi-qtsx icon20 to-24 stock-20">
                        </div>
                    </div>
                    <div class="icon-function-nav icon-nav-hover export">
                        <div class="icon mi-qtsx icon24 icon-reminder-24 ">
                        </div>
                    </div>
                    <!-- Separator -->
                    <div data-v-9bc15201="" class="ml-3 nav-separator"></div>
                    <div class="icon-function-nav icon-nav-hover export">
                        <div class="icon mi-warehouse icon24 setting ">
                        </div>
                    </div>
                    <div class="icon-function-nav notification-count">
                        <span class="count-noti">99+</span>
                        <div class="icon mi-warehouse icon24 bell"></div>
                    </div>
                    <div class="icon-function-nav icon-nav-hover export">
                        <div class="icon mi-warehouse icon24 question-circle">
                        </div>
                    </div>
                    <div class="icon-function-nav icon-nav-hover export">
                        <div class="icon mi-qtsx icon24 dots-circle-horizontal">
                        </div>
                    </div>
                    <div class="profile">
                        <div class="avatar">
                            <img src="../../../assets/images/production/Avatar.svg" alt="Avatar" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.navbar-container {
    display: flex;
    align-items: center;
    height: 100%;
}

.nav-item {
    height: 100%;
}

.nav-item.left {
    max-width: 200px;
    display: flex;
    align-items: center;
    padding-left: 16px;
    margin-right: 16px;

    .logo-menu {
        background-color: white;
    }

    .app-logo {
        background-image: url('../../../assets/images/production/ic_production_100px.svg');
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-size: contain;
    }

    .app-text {
        font-size: 20px;
        margin-left: 12px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
    }


    .home {
        margin-left: 16px;
        display: flex;
        align-items: center;
        width: 140px;
        cursor: pointer;
    }
}

.nav-item.right {
    flex: 1;
    padding: 0 16px 0 20px;

    .nav-item-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;



        .nav-item-content-left {
            display: flex;
            align-items: center;
            margin-top: 2px;


            .name-company-title {
                max-width: 440px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-right: .25rem;
                font-size: 13px;
                font-weight: 500;
                color: #fff;
            }

            cursor: pointer;
        }

        .nav-item-content-right {
            display: flex;
            height: 100%;
            align-items: center;

            .icon-function-nav {
                cursor: pointer;
                position: relative;
                margin-left: 12px;

                .icon {
                    background-color: #fff;
                }
            }

            .nav-separator {
                width: 1px;
                height: 16px;
                background: rgba(255, 255, 255, .3);
                align-self: center;
                border-radius: 1px;
            }

            .notification-count {
                position: relative;

                .count-noti {
                    display: inline-block;
                    height: 15px;
                    border-radius: 25px;
                    background-color: #f04438;
                    position: absolute;
                    color: #fff;
                    text-align: center;
                    font-size: 10px;
                    line-height: 16px;
                    padding: 0 6px;
                    top: -6px;
                    left: 50%;
                    z-index: 1;
                }
            }

            .profile {
                margin-left: 16px;
                border: 1px solid rgba(255, 255, 255, .3);
                border-radius: 9999px;
                width: 32px;
                height: 32px;
                position: relative;
                min-width: 32px;
                min-height: 32px;

                .avatar {
                    border-radius: 50%;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    overflow: hidden;
                    border-width: medium;
                    border-style: none;
                    border-color: currentcolor;
                    border-image: initial;

                    img {
                        width: 100%;
                        height: 100%;
                        max-width: 32px;
                        max-height: 32px;
                    }
                }
            }

        }

        .angle-down-small {
            background-color: #fff;
        }
    }
}
</style>